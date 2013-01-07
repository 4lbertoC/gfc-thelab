define(['./constants', './pubsub'], function(constants, pubSub) {
    'use strict';

    return {
        init: function() {
            constants.JQ_BUGS_TERMINAL.resizable({
                handles: "n, e, w, ne, nw",
                start: function() {
                    constants.JQ_BUGS_TERMINAL.addClass('resizing');
                },
                stop: function() {
                    constants.JQ_BUGS_TERMINAL.removeClass('resizing');
                    constants.JQ_BUGS_TERMINAL.css('top', '');
                    constants.JQ_BUGS_TERMINAL.css('left', '');
                    constants.JQ_BUGS_TERMINAL.css('bottom', '5px');
                    constants.JQ_BUGS_TERMINAL.css('right', '1px');
                }
            });
            constants.JQ_TERMINAL_TOGGLE.button({
                icons: {
                    primary: 'ui-icon-power'
                },
                text: false
            });
            constants.JQ_BUGS_TERMINAL.hide();
            constants.JQ_FAQ_CONTENT.mCustomScrollbar();
        },

        showDialog: function(title, text, buttons, optParams) {
            var thisUiManager = this;
            pubSub.publish('Dialog/open');
            constants.JQ_MSGDIALOG.removeClass('dialogHidden');
            constants.JQ_MSGDIALOG.html(text);
            var defaultParams = {
                title: title,
                modal: true,
                show: 'drop',
                hide: 'drop',
                width: Math.min(400, window.innerWidth - 20),
                height: Math.min(400, window.innerHeight - 20),
                maxWidth: window.innerWidth - 20,
                maxHeight: window.innerHeight - 20,
                buttons: buttons,
                open: function() {
                    pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                    thisUiManager.applyCustomStyle();
                },
                beforeClose: function() {
                    pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                    pubSub.publish('Dialog/close');
                }
            };
            if (optParams && typeof optParams === 'object') for (var p in optParams) {
                defaultParams[p] = optParams[p];
            }
            constants.JQ_MSGDIALOG.dialog(defaultParams).mCustomScrollbar();
        },

        showTitleInfo: function() {
            var thisUiManager = this;
            pubSub.publish("Dialog/open");
            constants.JQ_FAQ_CONTENT.dialog({
                title: '"Couldn\'t you add a clue to find this dialog?!?" "No."',
                width: Math.min(500, window.innerWidth - 20),
                height: Math.min(450, window.innerHeight - 20),
                maxWidth: window.innerWidth - 20,
                maxHeight: window.innerHeight - 20,
                modal: true,
                show: 'drop',
                hide: 'drop',
                open: function() {
                    pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                    thisUiManager.applyCustomStyle();
                },
                beforeClose: function() {
                    pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                    pubSub.publish('Dialog/close');
                }
            });
        },

        applyCustomStyle: function() {
            constants.getJQ_HELP_BUTTONS().button({
                icons: {
                    primary: 'ui-icon-help'
                }
            }).click(function() {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
            });
            constants.getJQ_LINKS().button({
                icons: {
                    primary: 'ui-icon-extlink'
                }
            }).click(function() {
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
            });
            constants.getJQ_ACCORDIONS().accordion({
                active: false,
                activate: function(evt, ui) {
                    $(evt.target).resize();
                    if (ui.newHeader.hasClass('spoiler')) {
                        pubSub.publish('AchievementManager/openSpoiler', [10]);
                    }
                },
                beforeActivate: function() {
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
});