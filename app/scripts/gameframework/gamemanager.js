define(['jquery', './achievementmanager', './audiomanager', './codeeditor', './constants', './pubsub', './terminal', './uimanager', './mutationobserver'],

function($, achievementManager, audioManager, codeEditor, constants, pubSub, terminal, uiManager, mutationObserver) {
    'use strict';

    /* Constants */
    var DEFAULT_CLOSE_BTN = {
        text: 'Close',
        click: function() {
            $(this).dialog('close');
            pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
        }
    };

    /* Private variables */
    var _showHints = true;

    /* Private methods */
    var _prepareAndShowTitleInfo = function() {
        if (constants.JQ_DARKNESS.parent()) {
            constants.JQ_I_AM_STUCK.html(constants.Text.HINT_DARKNESS);
        }
        uiManager.showTitleInfo();
    };

    var _showStartDialog = function() {
        var showUI = function() {
            constants.JQ_TERMINAL_TOGGLE.toggle('fade', 2000);
            constants.JQ_MENU_BUTTON.toggle('fade', 2000);
        };
        pubSub.publish('Dialog/open');
        uiManager.showDialog('Games for Coders - ' + constants.APP_NAME, constants.Text.TUTORIAL_INTRO, [{
            text: 'Normal',
            click: function() {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                $(this).dialog('close');
            }
        }, {
            text: 'Difficult',
            click: function() {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                _showHints = false;
                $(this).dialog('close');
            }
        }], {
            beforeClose: function() {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                pubSub.publish('Dialog/close');
                showUI();
                if (_showHints) {
                    _showFirstTooltip();
                }
            }
        });
    };

    var _showFirstTooltip = function() {
        constants.JQ_TERMINAL_TOGGLE.tooltip({
            content: 'Open/Close terminal'
        });
        constants.JQ_MENU_BUTTON.tooltip({
            content: 'Menu'
        });
        constants.JQ_TERMINAL_TOGGLE.tooltip('open');
        constants.JQ_MENU_BUTTON.tooltip('open');
        setTimeout(function() {
            constants.JQ_TERMINAL_TOGGLE.tooltip('close');
            constants.JQ_MENU_BUTTON.tooltip('close');
        }, 2000);
    };

    /* PubSub */
    pubSub.subscribeOnce('GameManager/showLoginHint', function(evt, isLogged) {
        if (_showHints) {
            uiManager.showDialog('Tutorial', constants.Text.HINT_LOGIN, [DEFAULT_CLOSE_BTN]);
        }
    });

    pubSub.subscribeOnce('GameManager/showJsTerminalHint', function(evt) {
        if (_showHints) {
            uiManager.showDialog('Tutorial', constants.Text.HINT_JSTERMINAL, [DEFAULT_CLOSE_BTN]);
        }
    });

    return {
        init: function() {
            codeEditor.init();
            terminal.init(window['gameScope']);
            uiManager.init();
            audioManager.init();
            mutationObserver.init();

            constants.JQ_TERMINAL_TOGGLE.click(function() {
                terminal.toggleShow.apply(terminal, arguments);
            });
            constants.JQ_MENU_BUTTON.click(_prepareAndShowTitleInfo);
            constants.JQ_SOUND_TOGGLE.click(function() {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                audioManager.toggleSound();
            });
            constants.JQ_MUSIC_TOGGLE.click(function() {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                audioManager.toggleMusic();
            });

            _showStartDialog();
        }
    };
});