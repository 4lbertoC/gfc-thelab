define(['jquery', 'gameframework/constants', 'gameframework/gamemanager', 'gameframework/pubsub', 'thelab/bugterium', 'thelab/spore'], function ($, constants, GameManager, pubSub, Bugterium, Spore) {
    'use strict';

    /* Private variables */

    var _gameManager = null;
    var _gameScope = null;

    var _isGlassBroken = constants.JQ_GLASS.hasClass(constants.CLASS_BROKEN);

    var _showHints = true;
    var _goalBugCount = 10;

    /* Private methods */
    var _addDarknessCallback = function () {
        // Runs when the darkness disappears, activating the lab commands.
        var _callbackId;

        function _addLabCommands() {
            pubSub.publish('Terminal/write', [constants.Text.LIGHTS_ON_TERMINAL]);

            var _addSpore = function (dna) {
                if((dna === undefined) || (dna instanceof Object) && (typeof dna.aspect === 'string')) {
                    new Spore(constants.ID_DISH, dna);
                } else {
                    pubSub.publish('UI/alert', [constants.Text.WRONG_PARAMS_ADDSPORE]);
                }
            };

            var _cleanDish = function () {
                constants.JQ_GLASS.addClass(constants.CLASS_BROKEN);
                pubSub.publish('AudioManager/playSound', [constants.Sound.GLASS_BREAK]);
                pubSub.publish('UI/talk', ['Command broken', constants.Text.HINTS_PERSON_NAME, constants.Text.CLEAN_DISH_BROKEN]);
            };

            var _moveToFlask = function (bugId) {
                var theBug = Bugterium.getById(bugId);
                if(!theBug) {
                    pubSub.publish('UI/alert', [constants.Text.WRONG_PARAMS_MOVETOFLASK]);
                    return;
                }
                theBug.moveTo(constants.ID_FLASK, [5, 40, 50, 10], function (status) {
                    if(status === 'success') {
                        pubSub.publish('AchievementManager/achieve', ['bug_captured']);
                    } else {
                        pubSub.publish('UI/talk', ['The bugterium is too big', constants.Text.HINTS_PERSON_NAME, constants.Text.BUGTERIUM_TOO_BIG]);
                    }
                });
            };

            _gameScope.addCommand('addSpore', function (dna) {
                _addSpore(dna);
            }, '\n[[g;#0ff;transparent]addSpore(dna)]\n\nAdds a spore to the [[g;#f0f;transparent]dish], from which one or more bugteria will spawn.' + '\n\n' + 'Parameters:\n' + '   [[g;#ff0;transparent]dna]: {Object} the optional DNA of the bugteria\n');
            _gameScope.addCommand('cleanDish', function () {
                _cleanDish();
            }, '\n[[g;#0ff;transparent]cleanDish()]\n\nCl3anz t%e d111sSSSSHHHHHH [[g;#f00;transparent]ERR][[bg;#fff;#f00]O][[g;#f00;transparent]R].' + '\n');
            _gameScope.addCommand('getBaseDna', function () {
                return Bugterium.getBaseDna();
            }, '\n[[g;#0ff;transparent]getBaseDna()]\n\nReturns the stock bugterium DNA.' + '\n\n' + 'Parameters:\n' + '   - none -\n');
            _gameScope.addCommand('moveToFlask', function (bugId) {
                _moveToFlask(bugId);
            }, '\n[[g;#0ff;transparent]moveToFlask(bugId)]\n\nMoves a bugterium to the flask.' + '\n\n' + 'Parameters:\n' + '   [[g;#ff0;transparent]bugId]: {number} the id of the bugterium to move\n');
            if(_callbackId) {
                pubSub.publish('MutationObserver/remove', [_callbackId]);
            }
        }

        function _darknessMutationObserverCallback(summaries) {
            var isDarknessRemoved = (summaries && (typeof summaries === 'object') && (typeof summaries[0] === 'object') && (typeof summaries[0].removed[0] === 'object') && (typeof summaries[0].removed[0] === 'object') && summaries[0].removed[0]['id'] === 'darkness');
            if(isDarknessRemoved) {
                constants.Text.HINTS_PERSON_NAME = 'Doctor Div';
                _addLabCommands();
                pubSub.publish('AchievementManager/achieve', ['darkness_removed']);
                pubSub.publish('GameEvent/darknessRemoved');
            }
            // TODO Also display = none or width = 0 or height = 0 would work
        }

        function _glassRemovalMutationObserverCallback(summaries) {
            var isGlassRemoved = (summaries && (typeof summaries === 'object') && (typeof summaries[0] === 'object') && (typeof summaries[0].removed[0] === 'object') && (typeof summaries[0].removed[0] === 'object') && summaries[0].removed[0]['id'] === 'glass');
            if(isGlassRemoved) {
                pubSub.publish('GameEvent/glassRemoved');
                pubSub.publish('UI/talk', ['Uh oh...', constants.Text.HINTS_PERSON_NAME, constants.Text.GLASS_REMOVED]);
                // TODO Play alarm sound
                // TODO Connect terminal to the event, that has to lock itself. Put the password in the html?
            }
        }

        function _glassBrokenMutationObserverCallback(summaries) {
            var isGlassBroken = constants.JQ_GLASS.hasClass(constants.CLASS_BROKEN);
            if(isGlassBroken && !_isGlassBroken) {
                pubSub.publish('GameEvent/glassBroken');
                pubSub.publish('UI/talk', ['Uh oh...', constants.Text.HINTS_PERSON_NAME, constants.Text.GLASS_BROKEN]);
                // TODO Play glass broken sound
            } else if(!isGlassBroken && _isGlassBroken) {
                pubSub.publish('AchievementManager/achieve', ['glass_repaired']);
                pubSub.publish('GameEvent/glassRepaired');
                pubSub.publish('UI/talk', ['Phew!', constants.Text.HINTS_PERSON_NAME, constants.Text.GLASS_REPAIRED]);
            }
            _isGlassBroken = isGlassBroken;
        }

        function _getCapturedBugsFeedback(bugNodeArray) {
            var bugKinds = {};
            var _addOfType = function (type) {
                bugKinds[type] ? bugKinds[type]++ : (bugKinds[type] = 1);
            };
            $.each(bugNodeArray, function (idx, bugNode) {
                var bug = Bugterium.getById(bugNode.id);
                if(bugNode.classList.contains('virus')) {
                    _addOfType('virus');
                } else if(bug.dna.aspect === '' || bugNode.style.visibility === 'hidden' || bugNode.style.display === 'none') {
                    _addOfType('invisible');
                } else if(bugNode.offsetWidth > 40 || bugNode.offsetHeight > 40) {
                    _addOfType('bigger');
                } else if(!bug.dna.replicationSpeed) {
                    _addOfType('inhibited');
                } else if(bug.dna.aspect !== Bugterium.getBaseDna().aspect) {
                    _addOfType('mutated');
                } else {
                    _addOfType('normal');
                }
            });
            return bugKinds;
        }

        function _flaskAddMutationObserver(summaries) {
            var children = constants.JQ_FLASK.children();
            var okBugs = [];
            $.each(children, function (idx, child) {
                while(true) {
                    if(child.classList.contains('bug')) {
                        okBugs.push(child);
                        break;
                    } else {
                        var c = $(child).children();
                        if(c.length > 0) {
                            child = c[0];
                        } else {
                            break;
                        }
                    }
                }
            });
            if(okBugs.length >= _goalBugCount) {
                var bugTypes = _getCapturedBugsFeedback(okBugs);
                console.log(bugTypes);
                pubSub.publish('AchievementManager/achieve', ['collect_10_bugs']);
                pubSub.publish('UI/talk', ['Great job!', constants.Text.HINTS_PERSON_NAME, constants.Text.COLLECT_10_BUGS]);
            }
        }

        function _dishOverflowMutationObserver(summaries) {
            // TODO
        }

        pubSub.publish('MutationObserver/add', [constants.JQ_DARKNESS.parent(), _darknessMutationObserverCallback, [{
            'element': '#darkness'
        }], function (id) {
            _callbackId = id;
        }]);
        pubSub.publish('MutationObserver/add', [constants.JQ_GLASS.parent(), _glassRemovalMutationObserverCallback, [{
            'element': '#glass'
        }], function (id) {

        }]);
        pubSub.publish('MutationObserver/add', [constants.JQ_GLASS, _glassBrokenMutationObserverCallback, [{
            'attribute': 'class'
        }], function (id) {

        }]);
        pubSub.publish('MutationObserver/add', [constants.JQ_FLASK, _flaskAddMutationObserver, [{
            'element': '.bug'
        }], function (id) {

        }]);
    };

    /* Private methods */
    var _prepareAndShowMenu = function () {
        if(constants.JQ_DARKNESS.parent()) {
            constants.JQ_I_AM_STUCK.html(constants.Text.I_AM_STUCK_TEXT);
        }
        _gameManager.showMenu();
    };

    var _showStartDialog = function () {
        pubSub.publish('UI/dialog', ['Games for Coders - ' + constants.APP_NAME, constants.Text.TUTORIAL_INTRO, [
            {
            text: 'Beginner',
            click: function (evt) {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
            }
        },
            {
            text: 'Intermediate',
            click: function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                $(this).dialog('close');
            }
        },
            {
            text: 'Difficult',
            click: function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                _showHints = false;
                $(this).dialog('close');
            }
        }],
        {
            close: function () {
                _showFirstMessage();
            }
        }]);
    };

    var _showFirstMessage = function () {
        var showUI = function () {
            constants.JQ_TERMINAL_TOGGLE.toggle('fade', 2000);
            constants.JQ_MENU_BUTTON.toggle('fade', 2000);
        };
        pubSub.publish('UI/talk', ['Message', constants.Text.HINTS_PERSON_NAME, constants.Text.ISANYONETHERE_MESSAGE, undefined,
        {
            beforeClose: function () {
                showUI();
                if(_showHints) {
                    _showFirstTooltip();
                }
            },
            close: function () {}
        }]);
    };

    var _showFirstTooltip = function () {
        constants.JQ_TERMINAL_TOGGLE.tooltip({
            content: 'Open/Close terminal'
        });
        constants.JQ_MENU_BUTTON.tooltip({
            content: 'Menu'
        });
        constants.JQ_TERMINAL_TOGGLE.tooltip('open');
        constants.JQ_MENU_BUTTON.tooltip('open');
        setTimeout(function () {
            constants.JQ_TERMINAL_TOGGLE.tooltip('close');
            constants.JQ_MENU_BUTTON.tooltip('close');
        }, 2000);
    };

    /* PubSub */
    pubSub.subscribeOnce('GameManager/showLoginHint', function () {
        if(_showHints) {
            pubSub.publish('UI/talk', ['Info', constants.Text.HINTS_PERSON_NAME, constants.Text.HINT_LOGIN]);
        }
    });

    pubSub.subscribeOnce('GameManager/showJsTerminalHint', function () {
        if(_showHints) {
            pubSub.publish('UI/talk', ['Info', constants.Text.HINTS_PERSON_NAME, constants.Text.HINT_JSTERMINAL]);
        }
    });

    var _initVars = function () {
        _gameManager = new GameManager();
        _gameManager.init();
        _gameScope = _gameManager.getTerminalScope();
    };

    var TheLabGame = {
        start: function (callback) {
            _initVars();
            // TODO
            // Create dish and flask here or create them in the html
            // Create bacteria's classes
            _addDarknessCallback();

            constants.JQ_MENU_BUTTON.click(_prepareAndShowMenu);

            _showStartDialog();

            if(callback) {
                setTimeout(function () {
                    callback();
                }, 1000);
            }
        }
    };
    return TheLabGame;
});