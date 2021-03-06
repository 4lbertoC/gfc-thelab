define(['jquery', 'gameframework/constants', 'gameframework/gamemanager', 'gameframework/pubsub', 'thelab/bugterium', 'thelab/spore'], function ($, constants, GameManager, pubSub, Bugterium, Spore) {
    'use strict';

    /* Private variables */

    var _gameManager = null;
    var _gameScope = null;

    var _isGlassBroken = constants.JQ_GLASS.hasClass(constants.CLASS_BROKEN);

    var _showHints = true;
    var _goalBugCount = 10;
    var _dishOverflowWarningGiven = false;
    var _deskOverflowWarningGiven = false;
    var _bugOnDeskWarningGiven = false;
    var _finishButtonShown = false;

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
                constants.Text.I_AM_STUCK_TEXT = constants.Text.HINT_GROW_BUGTERIA;
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
                if(bug) {
                    if(bug.isVirus) {
                        _addOfType('virus');
                        pubSub.publish('AchievementManager/achieve', ['virus_bug']);
                    } else if(bug.dna.aspect === '' || bugNode.style.visibility === 'hidden' || bugNode.style.display === 'none') {
                        _addOfType('invisible');
                        pubSub.publish('AchievementManager/achieve', ['invisible_bug']);
                        pubSub.publish('AchievementManager/achieve', ['mutated_bug']);
                    } else if(bugNode.offsetWidth > 40 || bugNode.offsetHeight > 40) {
                        _addOfType('bigger');
                        pubSub.publish('AchievementManager/achieve', ['bigger_bug']);
                    } else if(!bug.dna.replicationSpeed || ((typeof bug.dna.replicationSpeed === 'number') && bug.dna.replicationSpeed <= 0)) {
                        _addOfType('inhibited');
                        pubSub.publish('AchievementManager/achieve', ['inhibited_bug']);
                    } else if(bug.dna.aspect !== Bugterium.getBaseDna().aspect) {
                        _addOfType('mutated');
                        pubSub.publish('AchievementManager/achieve', ['mutated_bug']);
                    } else {
                        _addOfType('normal');
                    }
                }
            });
            return bugKinds;
        }

        function _flaskAddMutationObserver(summaries) {
            var okBugs = $('#flask>.bug');
            if(okBugs.length > 0) {
                pubSub.publish('AchievementManager/achieve', ['bug_captured']);
            }
            if(okBugs.length >= _goalBugCount && !_finishButtonShown) {
                _finishButtonShown = true;
                pubSub.publish('AchievementManager/achieve', ['collect_10_bugs']);
                pubSub.publish('UI/talk', ['Great job!', constants.Text.HINTS_PERSON_NAME, constants.Text.COLLECT_10_BUGS]);
                var finishButton = document.createElement('div');
                finishButton.classList.add('finishButton');
                var jqFinishButton = $(finishButton);
                jqFinishButton.text('Finish');
                document.body.appendChild(finishButton);
                jqFinishButton.button().click(function () {
                    var okBugs = $('#flask>.bug');
                    if(okBugs.length >= _goalBugCount) {
                        var bugTypes = _getCapturedBugsFeedback(okBugs);
                        $('#gameContainer').remove();
                        $('.terminalToggle').remove();
                        jqFinishButton.remove();
                        var finishMsg = '<p>Here are the results:</p><p>';
                        for(var type in bugTypes) {
                            finishMsg += '<br>' + type + ': ' + bugTypes[type];
                        }
                        var achievementManager = _gameManager.getGameModules().achievementManager;
                        var achievementCount = achievementManager.getAchievementCount();
                        var totalAchievementCount = achievementManager.getTotalAchievementCount();
                        var givenHintsCount = achievementManager.getGivenHintsCount();
                        var totalPoints = achievementManager.getPoints();
                        finishMsg += '</p><p>You completed ' + achievementCount + ' of ' +
                            totalAchievementCount + ' achievements.</p>';
                        finishMsg += '<p>You requested help ' + givenHintsCount + ' times</p>';
                        finishMsg += '<p>You gained a total of ' + totalPoints + ' points</p>';
                        if(achievementCount <= 5) {
                            finishMsg += '<p>Well... better than nothing.</p>';
                        } else if(achievementCount <= 8) {
                            finishMsg += '<p>You can do better than that, right?</p>';
                        } else if(achievementCount === totalAchievementCount) {
                            finishMsg += '<p>Impressive! You completed the game!';
                        } else {
                            finishMsg += '<p>Great job, but it\'s not over!</p>';
                        }
                        pubSub.publish('UI/talk', ['Mission accomplished!', constants.Text.HINTS_PERSON_NAME, finishMsg]);
                        var ga = window._gaq;
                        if(ga) {
                            ga.push(['_trackEvent', 'Game', 'Finish', 'Count of Achievements', achievementCount]);
                            ga.push(['_trackEvent', 'Game', 'Finish', 'Count of Given Hints', givenHintsCount]);
                            ga.push(['_trackEvent', 'Game', 'Finish', 'Total Points', totalPoints]);
                        }
                    } else {
                        pubSub.publish('UI/talk', ['Not enough bugteria!', constants.Text.HINTS_PERSON_NAME, constants.Text.LESS_THAN_10_BUGS]);
                    }
                });
            }
        }

        function _dishOverflowMutationObserver(summaries) {
            var children = constants.JQ_DISH.children();
            if(children.length >= 15 && !_dishOverflowWarningGiven) {
                _dishOverflowWarningGiven = true;
                pubSub.publish('UI/talk', ['Too many bugteria!', constants.Text.HINTS_PERSON_NAME, constants.Text.DISH_OVERFLOW_WARNING]);
            } else if(children.length >= 20) {
                var rand = Math.ceil(Math.random() * 2);
                while(rand-- > 0) {
                    children = constants.JQ_DISH.children();
                    var escapedBug = children.first();
                    var theBug = Bugterium.getById(escapedBug.prop('id'));
                    if(theBug) {
                        theBug.moveTo(constants.ID_DESK, [0, 40, 40, 0], null, true);
                    }
                }
            }
        }

        function _deskOverflowMutationObserver(summaries) {
            var children = $('#desk>.bug');
            if(children.length > 0 && !_bugOnDeskWarningGiven) {
                _bugOnDeskWarningGiven = true;
                pubSub.publish('UI/talk', ['I\'m a bit worried.', constants.Text.HINTS_PERSON_NAME, constants.Text.BUG_ON_DESK]);
            } else if(children.length >= 20 && !_deskOverflowWarningGiven && (!$('#' + constants.ID_GLASS).length || $('#' + constants.ID_GLASS).hasClass('broken'))) {
                _deskOverflowWarningGiven = true;
                if(window.localStorage) {
                    window.localStorage.setItem('bugEscaped', true);
                }
                $('.bug').addClass('invader');
                pubSub.publish('AudioManager/playSound', [constants.Sound.GAME_OVER]);
                pubSub.publish('UI/talk', ['OMGWTFBBQ!', constants.Text.HINTS_PERSON_NAME, constants.Text.INVASION_WARNING]);
                setTimeout(function () {
                    var a = document.createElement('div');
                    $(a).css({
                        top: '0',
                        left: '0',
                        position: 'fixed',
                        backgroundColor: 'black',
                        width: '100%',
                        height: '100%',
                        zIndex: 3999,
                        color: 'white',
                        textAlign: 'center',
                        fontFamily: 'courier'
                    });
                    var b = document.createElement('span');
                    $(b).css({
                        position: 'absolute',
                        top: '50%',
                        left: '0',
                        width: '100%'
                    }).text('Game over, reload the page.');
                    $(a).append(b);
                    $(document.body).append(a);
                    pubSub.publish('AudioManager/playSound', [constants.Sound.SCREAM]);
                    pubSub.publish('AchievementManager/achieve', ['game_over. yes, this is an achievement']);
                }, 5000);
            }
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
        pubSub.publish('MutationObserver/add', [constants.JQ_DISH, _dishOverflowMutationObserver, [{
            'element': '.bug'
        }], function (id) {

        }]);
        pubSub.publish('MutationObserver/add', [constants.JQ_DESK, _deskOverflowMutationObserver, [{
            'element': '.bug'
        }], function (id) {

        }]);
    };

    /* Private methods */
    var _prepareAndShowMenu = function () {
        if(constants.JQ_DARKNESS.parent()) {
            constants.JQ_I_AM_STUCK.html(constants.Text.I_AM_STUCK_TEXT);
        }
        pubSub.publish('AchievementManager/update', []);
        _gameManager.showMenu();
    };

    var _showStartDialog = function () {
        pubSub.publish('UI/dialog', ['Games for Coders - ' + constants.APP_NAME, constants.Text.TUTORIAL_INTRO, [
            {
            text: 'Play',
            click: function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
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
        var msg = constants.Text.ISANYONETHERE_MESSAGE;
        if(window.localStorage && window.localStorage.getItem('bugEscaped')) {
            msg = constants.Text.BUG_PREVIOUSLY_ESCAPED;
            window.localStorage.clear();
        }
        pubSub.publish('UI/talk', ['Message', constants.Text.HINTS_PERSON_NAME, msg, undefined,
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

            var dropFunc = function (event, ui) {
                var bug = ui.draggable;
                bug.detach();
                var jqThis = $(this);
                var jqThisOffset = jqThis.offset();
                var bugOffset = ui.offset;
                bug.css({
                    left: 0,
                    top: 0,
                    transform: 'translate(' + (bugOffset.left - jqThisOffset.left) + 'px,' + (bugOffset.top - jqThisOffset.top) + 'px)'
                });
                jqThis.append(bug);
            };
            constants.JQ_DESK.droppable({
                accept: '.bug',
                drop: dropFunc
            });
            constants.JQ_DISH.droppable({
                accept: '.bug',
                greedy: true,
                drop: dropFunc
            });

            constants.JQ_FLASK.droppable({
                accept: '.bug',
                greedy: true,
                drop: function (event, ui) {
                    var theBug = Bugterium.getById(ui.draggable.prop('id'));
                    if(theBug) {
                        theBug.moveTo(constants.ID_FLASK, [5, 40, 50, 10], function (status) {
                            if(status === 'success') {
                                pubSub.publish('AchievementManager/achieve', ['bug_captured']);
                                constants.Text.I_AM_STUCK_TEXT = constants.Text.HINT_BUGTERIUM_IN_FLASK;
                                ui.draggable.css({
                                    left: 0,
                                    top: 0
                                });
                            } else {
                                pubSub.publish('UI/talk', ['The bugterium is too big', constants.Text.HINTS_PERSON_NAME, constants.Text.BUGTERIUM_TOO_BIG]);
                                ui.draggable.css({
                                    left: 0,
                                    top: 0,
                                    transform: 'translate(50%, 50%)'
                                });
                            }
                        });
                    }
                }
            });


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