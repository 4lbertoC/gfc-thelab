define(['./constants', './gamescope', './pubsub'], function (constants, GameScope, pubSub) {
    'use strict';

    /* Private variables */
    var _instance = null;
    var _isEnabled = false;
    var _isShown = false;
    var _scope = null;

    var _evaluateJs = function (command, onSuccess, onError) {
        var result;
        try {
            result = (new Function('return ' + command))();
        } catch(e) {
            try {
                result = (new Function(command))();
            } catch(e) {
                if(typeof onError === 'function') {
                    onError(e.message);
                }
            }
        }
        if(result && typeof onSuccess === 'function') {
            onSuccess(result);
        }
    };

    var _jsInterpreter = {
        interpreter: function (command, term) {
            _evaluateJs(command, function (result) {
                var resultString = typeof result === 'object' ? _objectToString(result) : result.toString();
                term.echo(resultString);
            }, function (error) {
                term.error('Error: ' + error);
            });
        },
        params: {
            name: 'js',
            prompt: 'js> ',
            onStart: function () {
                _instance.clear();
                _instance.echo('[ JS Interpreter ]\n\nType [[g;#0ff;transparent]exit] to go back to menu.').css('color', '#0e0');
                _printCommands();
                pubSub.publish('GameManager/showJsTerminalHint');
            },
            onExit: function () {
                _instance.clear();
                _instance.echo(constants.Text.GREETINGS).css('color', '#ddd');
            }
        }
    };

    var _menuInterpreter = {
        interpreter: function (command, term) {
            if(command !== '') {
                if(command === 'js') {
                    _instance.push(_jsInterpreter.interpreter, _jsInterpreter.params);
                } else if(command === 'help') {
                    term.echo(constants.Text.HELP);
                } else if(command === 'light') {
                    if(constants.JQ_DARKNESS.parent().length === 0) {
                        term.echo('Lights already on.');
                    } else {
                        try {
                            window['light']();
                        } catch(e) {
                            pubSub.publish('AudioManager/playSound', [constants.Sound.FAILURE]);
                            term.echo(constants.Text.LIGHTS_BROKEN);
                        }
                    }
                } else {
                    term.echo('Unknown command. (try using [[g;#0ff;transparent]help])');
                }
            } else {
                term.echo('');
            }
        },
        params: {
            name: 'menu',
            prompt: 'menu> '
        }
    };

    /* Private methods */
    var _editCode = function (str) {
        if(str && typeof str != 'string') {
            pubSub.publish('UI/alert', [constants.Text.WRONG_PARAMS_EDITCODE]);
        } else {
            var codeContent = '';
            var cmd = _scope.getCommand(str);
            if(cmd) {
                codeContent = (typeof cmd) === 'object' ? _objectToString(cmd) : cmd.toString();
            }
            pubSub.publish('CodeEditor/show', [
                str ? str : 'Code (stored into <i>result</i>)',
                codeContent,
                function (newObj) {
                if(newObj) {
                    _evaluateJs(newObj, function (ret) {
                        cmd ? _scope.addCommand(str, ret) : window['result'] = ret;
                    }, function (error) {
                        _instance.error('Error: ' + error);
                    });
                }
            }
            ]);
        }
        pubSub.publish('Terminal/disable', []);
    };

    var _login = function (name, pwd, callback) {
        if(!callback) {
            return;
        }
        if(name === 'bugmaster' && pwd === '123star') {
            pubSub.publish('AchievementManager/achieve', [constants.Achievement.LOGGED_IN]);
            callback('bugmaster');
        } else {
            callback(false);
        }
    };

    var _objectToString = function (o) {
        // Source from http://www.davidpirek.com/blog/object-to-string-how-to-deserialize-json (edited)
        var parse = function (_o) {
            var a = [],
                t;
            for(var p in _o) {
                if(_o.hasOwnProperty(p)) {
                    t = _o[p];
                    if(t && typeof t === 'object') {
                        a[a.length] = p + ':{ ' + parse(t).join(', ') + '}';
                    } else {
                        if(typeof t === 'string') {

                            a[a.length] = [p + ': \'' + t.toString() + '\''];
                        } else if(typeof t === 'function') {
                            a[a.length] = [p + ': ' + t.toString()];
                        } else {
                            a[a.length] = [p + ': ' + JSON.stringify(t)];
                        }
                    }
                }
            }
            return a;
        };
        return '{' + parse(o).join(', ') + '}';
    };

    var _printCommands = function () {
        _instance.echo('Commands found:\n');
        var commands = _scope.getCommands();
        var commandList = '';
        for(var c in commands) {
            commandList += c + ' ';
        };
        _instance.echo('[[g;#0ff;transparent]' + commandList + ']\n');
    };

    var Terminal = function () {};
    Terminal.prototype = {
        disable: function () {
            if(_instance) {
                _isEnabled = false;
                _instance.disable();
            }
        },

        enable: function () {
            if(_instance) {
                _isEnabled = true;
                _instance.enable();
            }
        },

        getScope: function () {
            return _scope;
        },

        init: function () {
            _scope = new GameScope();
            window['result'] = null;

            _scope.addCommand('editCode', function (cmdName) {
                _editCode(cmdName);
            }, '\n[[g;#0ff;transparent]editCode(cmdName)]\n\nOpens the code editor.\nIf called without parameters, the JavaScript written in the editor will be evaluated ' +
            'and the result stored in a variable called [[g;#ff0;transparent]result].' +
            '\n\nThe name of a command can be passed as parameter to edit its code.' +
            '\n\n' +
            'Parameters:\n' +
            '   [[g;#ff0;transparent]cmdName]: {string} the optional command name\n');
            _scope.addCommand('printCommands',

            function () {
                _printCommands();
            }, '\n[[g;#0ff;transparent]printCommands()]\n\nShows the available commands.\n\n' +
            'Parameters:\n' +
            '   - none -\n');

            _scope.addCommand('light',

            function () {
                var _ = doc * m3 % T.g3tE13m3n73y1d('darkness');
                _.p42en7E1 & wEnt.re3ovecHi1D(_);
            }, '\n[[g;#0ff;transparent]lig%t()]\n\nT?rns 0n th3 lBZZZZZZZZ [[g;#f00;transparent]ERROR].\n');

            var params = {
                greetings: constants.Text.GREETINGS,
                name: 'bugsConsole',
                prompt: _menuInterpreter.params.prompt,
                login: _login,
                enabled: false,
                keypress: function () {
                    if(_isEnabled) {
                        pubSub.publish('AudioManager/playSound', [constants.Sound.KEYBOARD]);
                    }
                }
            };
            _instance = constants.JQ_CODE.terminal(_menuInterpreter.interpreter, params);
            _instance.resize();
            constants.JQ_TERMINAL.click(function () {
                _instance.resize();
                constants.JQ_TERMINAL.resize();
            });

            /* PubSub */
            var that = this;
            pubSub.subscribe('CodeEditor/close', function () {
                if(_isShown) {
                    that.enable();
                }
            });
            pubSub.subscribe('Dialog/open', function () {
                if(_isShown) {
                    that.disable();
                }
            });
            pubSub.subscribe('Dialog/close', function () {
                if(_isShown) {
                    that.enable();
                }
            });
            pubSub.subscribe('Terminal/disable', function () {
                that.disable();
            });
            pubSub.subscribe('Terminal/enable', function () {
                that.enable();
            });
            pubSub.subscribe('Terminal/write', function (evt, text) {
                _instance.echo(text);
            });
        },

        toggleShow: function () {
            constants.JQ_TERMINAL.width(Math.min(constants.JQ_TERMINAL.width(), window.innerWidth - 50));
            constants.JQ_TERMINAL.height(Math.min(constants.JQ_TERMINAL.height(), window.innerHeight - 50));
            constants.JQ_TERMINAL.toggle('slide', {
                direction: 'down',
                easing: 'easeOutCirc',
                complete: function () {
                    if(!_instance.login_name()) {
                        pubSub.publish('GameManager/showLoginHint');
                    }
                    constants.JQ_TERMINAL.resize();
                }
            }, 1500);
            _isShown = !_isShown;
            if(_isShown) {
                pubSub.publish('AudioManager/playSound', [constants.Sound.TERMINAL_ON]);
                this.enable();
            } else {
                pubSub.publish('AudioManager/playSound', [constants.Sound.TERMINAL_OFF]);
                this.disable();
            }
        }
    };
    return Terminal;
});