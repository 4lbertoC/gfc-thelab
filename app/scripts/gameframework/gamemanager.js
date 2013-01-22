define(['jquery', './achievementmanager', './audiomanager', './codeeditor', './constants', './pubsub', './terminal', './uimanager', './mutationobserver'], function ($, achievementManager, AudioManager, CodeEditor, constants, pubSub, Terminal, UiManager, MutationObserver) {
    'use strict';

    /* Private variables */
    var _gameModules = {
        achievementManager: null,
        audioManager: null,
        codeEditor: null,
        mutationObserver: null,
        terminal: null,
        uiManager: null
    };

    var _showHints = true;

    /* Private methods */
    var _prepareAndShowTitleInfo = function () {
        if(constants.JQ_DARKNESS.parent()) {
            constants.JQ_I_AM_STUCK.html(constants.Text.HINT_DARKNESS);
        }
        _gameModules.uiManager.showTitleInfo();
    };

    var _showStartDialog = function () {
        var showUI = function () {
            constants.JQ_TERMINAL_TOGGLE.toggle('fade', 2000);
            constants.JQ_MENU_BUTTON.toggle('fade', 2000);
        };
        pubSub.publish('Dialog/open');
        _gameModules.uiManager.showDialog('Games for Coders - ' + constants.APP_NAME, constants.Text.TUTORIAL_INTRO, [{
            text: 'Normal',
            click: function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                $(this).dialog('close');
            }
        }, {
            text: 'Difficult',
            click: function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                _showHints = false;
                $(this).dialog('close');
            }
        }], {
            beforeClose: function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                pubSub.publish('Dialog/close');
                showUI();
                if(_showHints) {
                    _showFirstTooltip();
                }
            }
        });
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
    pubSub.subscribeOnce('GameManager/showLoginHint', function (evt, isLogged) {
        if(_showHints) {
            _gameModules.uiManager.showDialog('Tutorial', constants.Text.HINT_LOGIN, [constants.Buttons.DEFAULT_CLOSE_BTN]);
        }
    });

    pubSub.subscribeOnce('GameManager/showJsTerminalHint', function (evt) {
        if(_showHints) {
            _gameModules.uiManager.showDialog('Tutorial', constants.Text.HINT_JSTERMINAL, [constants.Buttons.DEFAULT_CLOSE_BTN]);
        }
    });

    var GameManager = function () {};
    GameManager.prototype = {
        getGameModules: function () {
            return _gameModules;
        },
        getTerminalScope: function () {
            return _gameModules.terminal.getScope();
        },
        init: function () {
            _gameModules.codeEditor = new CodeEditor();
            _gameModules.mutationObserver = new MutationObserver();
            _gameModules.audioManager = new AudioManager();
            _gameModules.terminal = new Terminal();
            _gameModules.uiManager = new UiManager();

            _gameModules.codeEditor.init();
            _gameModules.mutationObserver.init();
            _gameModules.audioManager.init();
            _gameModules.uiManager.init();
            _gameModules.terminal.init();

            constants.JQ_TERMINAL_TOGGLE.click(function () {
                _gameModules.terminal.toggleShow.apply(_gameModules.terminal, arguments);
            });
            constants.JQ_MENU_BUTTON.click(_prepareAndShowTitleInfo);
            constants.JQ_SOUND_TOGGLE.click(function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                _gameModules.audioManager.toggleSound();
            });
            constants.JQ_MUSIC_TOGGLE.click(function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                _gameModules.audioManager.toggleMusic();
            });

            _showStartDialog();
        }
    };
    return GameManager;
});