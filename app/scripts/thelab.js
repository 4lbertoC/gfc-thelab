define(['jquery', 'gameframework/constants', 'gameframework/gamemanager', 'gameframework/pubsub'], function ($, constants, GameManager, pubSub) {
    'use strict';

    /* Private variables */
    var _gameManager = null;
    var _gameScope = null;

    var _hintsPersonName = 'Someone in the dark';

    var _showHints = true;

    /* Private methods */
    var _addDarknessCallback = function () {
        // Runs when the darkness disappears, activating the lab commands.
        var _callbackId;

        function _addLabCommands() {
            pubSub.publish('Terminal/write', [constants.Text.LIGHTS_ON_TERMINAL]);
            _gameScope.addCommand('addSpore', function (dna) {
                // TODO
            });
            _gameScope.addCommand('cleanDish', function () {
                // TODO
            });
            _gameScope.addCommand('getBaseDna', function () {
                // TODO
            });

            if(_callbackId) {
                pubSub.publish('MutationObserver/remove', [_callbackId]);
            }
        }

        function _darknessMutationObserverCallback(summaries) {
            var isDarknessRemoved = (summaries && (typeof summaries === 'object') && (typeof summaries[0] === 'object') && (typeof summaries[0].removed[0] === 'object') && (typeof summaries[0].removed[0] === 'object') && summaries[0].removed[0]['id'] === 'darkness');
            if(isDarknessRemoved) {
                _hintsPersonName = 'Doctor Div';
                _addLabCommands();
                pubSub.publish('AchievementManager/achieve', ['darkness_removed']);
                pubSub.publish('GameEvent/darknessRemoved');
                pubSub.publish('UI/talk', ['Great job!', _hintsPersonName, constants.Text.LIGHTS_ON_ALERT]);
            }
            // TODO Also display = none or width = 0 or height = 0 would work
        }

        pubSub.publish('MutationObserver/add', [constants.JQ_DARKNESS.parent(), _darknessMutationObserverCallback, [{
            'element': '#darkness'
        }], function (id) {
            _callbackId = id;
        }]);
    };

    /* Private methods */
    var _prepareAndShowMenu = function () {
        if(constants.JQ_DARKNESS.parent()) {
            constants.JQ_I_AM_STUCK.html(constants.Text.HINT_DARKNESS);
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
        pubSub.publish('UI/talk', ['Message', _hintsPersonName, constants.Text.ISANYONETHERE_MESSAGE, undefined,
        {
            beforeClose: function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                pubSub.publish('Dialog/close');
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
            pubSub.publish('UI/talk', ['Info', _hintsPersonName, constants.Text.HINT_LOGIN]);
        }
    });

    pubSub.subscribeOnce('GameManager/showJsTerminalHint', function () {
        if(_showHints) {
            pubSub.publish('UI/talk', ['Info', _hintsPersonName, constants.Text.HINT_JSTERMINAL]);
        }
    });

    var _initVars = function () {
        _gameManager = new GameManager();
        _gameManager.init();
        _gameScope = _gameManager.getTerminalScope();
    };

    var TheLabGame = {
        start: function () {
            _initVars();
            // TODO
            // Create dish and flask here or create them in the html
            // Create bacteria's classes
            _addDarknessCallback();

            constants.JQ_MENU_BUTTON.click(_prepareAndShowMenu);

            _showStartDialog();
        }
    };
    return TheLabGame;
});