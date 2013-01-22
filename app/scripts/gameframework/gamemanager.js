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
            constants.JQ_SOUND_TOGGLE.click(function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                _gameModules.audioManager.toggleSound();
            });
            constants.JQ_MUSIC_TOGGLE.click(function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                _gameModules.audioManager.toggleMusic();
            });
        },
        showMenu: function () {
            _gameModules.uiManager.showMenu();
        }
    };
    return GameManager;
});