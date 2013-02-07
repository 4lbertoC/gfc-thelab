define(['jquery', './constants', './pubsub'], function ($, constants, pubSub) {
    'use strict';

    /* Private variables */
    var _dialogQueue = [];
    var _isDialogShown = false;

    var UiManager = function () {};
    UiManager.prototype = {
        init: function () {
            constants.JQ_TERMINAL.resizable({
                handles: 'n, e, w, ne, nw',
                start: function () {
                    constants.JQ_TERMINAL.addClass('resizing');
                },
                stop: function () {
                    constants.JQ_TERMINAL.removeClass('resizing');
                    constants.JQ_TERMINAL.css('top', '');
                    constants.JQ_TERMINAL.css('left', '');
                    constants.JQ_TERMINAL.css('bottom', '5px');
                    constants.JQ_TERMINAL.css('right', '1px');
                }
            });
            constants.JQ_TERMINAL_TOGGLE.button({
                icons: {
                    primary: 'ui-icon-power'
                },
                text: false
            });
            constants.JQ_MENU_BUTTON.button({
                icons: {
                    primary: 'ui-icon-gear'
                },
                text: false
            });
            constants.JQ_TERMINAL.hide();
            constants.JQ_MENU.mCustomScrollbar();

            /* PubSub */
            var that = this;
            pubSub.subscribe('UI/alert', function (evt, text, optTitle) {
                that.showDialog(optTitle || 'Message', text, [constants.Buttons.getDefaultCloseButton()]);
            });
            pubSub.subscribe('UI/dialog', function (evt, title, text, buttons, optParams) {
                that.showDialog(title, text, buttons, optParams);
            });
            pubSub.subscribe('UI/talk', function (evt, title, personName, text, buttons, optParams) {
                that.showPersonTalking(title, personName, text, buttons, optParams);
            });
        },

        showDialog: function (title, text, buttons, optParams) {
            var thisUiManager = this;
            if(_isDialogShown) {
                _dialogQueue.push(function () {
                    thisUiManager.showDialog(title, text, buttons, optParams);
                })
                return;
            }
            _isDialogShown = true;
            pubSub.publish('Dialog/open');
            constants.JQ_MSGDIALOG.removeClass('dialogHidden');
            constants.JQ_MSGDIALOG.html(text);
            var defaultParams = {
                title: title || 'Message',
                modal: true,
                show: 'drop',
                hide: 'drop',
                width: Math.min(400, window.innerWidth - 20),
                height: Math.min(400, window.innerHeight - 20),
                maxWidth: window.innerWidth - 20,
                maxHeight: window.innerHeight - 20,
                buttons: buttons || [constants.Buttons.getDefaultCloseButton()],
                open: function () {
                    pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                    thisUiManager.applyCustomStyle();
                },
                beforeClose: function () {
                    pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                    pubSub.publish('Dialog/close');
                },
                close: function() {
                    _isDialogShown = false;
                    if(_dialogQueue.length > 0) {
                        var nextDialog = _dialogQueue.shift();
                        nextDialog();
                    }
                }
            };
            if(optParams && typeof optParams === 'object') {
                var appendOptFunc = function(baseFunc, optFunc) {
                    return function() {
                        baseFunc();
                        optFunc();
                    };
                };
                for(var p in optParams) {
                    if(typeof defaultParams[p] === 'function') {
                        defaultParams[p] = appendOptFunc(defaultParams[p], optParams[p]);
                    } else {
                        defaultParams[p] = optParams[p];
                    }
                }
            }
            constants.JQ_MSGDIALOG.dialog(defaultParams).mCustomScrollbar();
        },

        showPersonTalking: function (title, personName, text, buttons, optParams) {
            this.showDialog(title, '<h3 class="personTalking">' + personName + ' says:</h3><blockquote>' + text + '</blockquote>', buttons, optParams);
        },

        showMenu: function () {
            var thisUiManager = this;
            pubSub.publish('Dialog/open');
            constants.JQ_MENU.dialog({
                title: 'Menu',
                width: Math.min(500, window.innerWidth - 20),
                height: Math.min(450, window.innerHeight - 20),
                maxWidth: window.innerWidth - 20,
                maxHeight: window.innerHeight - 20,
                modal: true,
                show: 'drop',
                hide: 'drop',
                open: function () {
                    pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                    thisUiManager.applyCustomStyle();
                },
                beforeClose: function () {
                    pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                    pubSub.publish('Dialog/close');
                }
            });
        },

        applyCustomStyle: function () {
            constants.getJQ_HELP_BUTTONS().button({
                icons: {
                    primary: 'ui-icon-help'
                }
            }).click(function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
            });
            constants.getJQ_LINKS().button({
                icons: {
                    primary: 'ui-icon-extlink'
                }
            }).click(function () {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
            });
            constants.getJQ_ACCORDIONS().accordion({
                active: false,
                activate: function (evt, ui) {
                    $(evt.target).resize();
                    if(ui.newHeader.hasClass('spoiler')) {
                        pubSub.publish('AchievementManager/openSpoiler', [10]);
                    }
                },
                beforeActivate: function () {
                    pubSub.publish('AudioManager/playSound', [constants.Sound.ACCORDION]);
                },
                collapsible: true,
                heightStyle: 'content',
                icons: {
                    'header': 'ui-icon-circle-triangle-e',
                    'headerSelected': 'ui-icon-circle-triangle-s'
                }
            });
        }
    };
    return UiManager;
});