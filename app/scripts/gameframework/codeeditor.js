define(['./constants', './pubsub'], function(constants, pubsub) {
    'use strict';

    /* Private variables */
    var _instance = null;

    /* Private methods */
    var formatCode = function() {
        var totalLines = _instance.lineCount();
        var totalChars = _instance.getValue().length;
        _instance.autoFormatRange({
            line: 0,
            ch: 0
        }, {
            line: totalLines,
            ch: totalChars
        });
        _instance.setCursor(0, 0);
    };

    return {
        init: function() {
            _instance = _instance || CodeMirror(constants.CODEMIRROR_ELEMENT, {
                value: 'function myScript() {\n\treturn 100;\n}\n',
                mode: {
                    name: 'javascript',
                    json: true
                },
                theme: 'ambiance',
                lineWrapping: true
            });
            
            /* Pubsub */
            var that = this;
            pubsub.subscribe('CodeEditor/show', function(evt, title, code, callback) {
                that.show(title, code, callback);
            });
        },

        show: function(title, code, callback) {
            var closeEditor = function() {
                pubsub.publish('CodeEditor/close');
            };
            _instance.setValue(code);
            constants.JQ_JSDIALOG.removeClass('dialogHidden');
            constants.JQ_JSDIALOG.dialog({
                title: title,
                modal: true,
                show: 'fold',
                hide: 'fold',
                width: Math.ceil(window.innerWidth * 0.8),
                buttons: [{
                    text: 'Ok',
                    click: function() {
                        pubsub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                        if (callback) {
                            callback(_instance.getValue());
                        }
                        $(this).dialog('close');
                        closeEditor();
                    }
                }, {
                    text: 'Cancel',
                    click: function() {
                        pubsub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
                        $(this).dialog('close');
                        closeEditor();
                    }
                }],
                beforeClose: function() {
                    pubsub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                },
                open: function() {
                    formatCode();
                    pubsub.publish('AudioManager/playSound', [constants.Sound.DIALOG_SHOW]);
                },
                focus: function() {
                    _instance.refresh();
                    _instance.focus();
                }
            });
        }
    };
});