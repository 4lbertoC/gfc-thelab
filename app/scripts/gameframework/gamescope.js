define([], function () {

    var GameScope = function () {
        var commands = {};
        var help = {};

        this.addCommand = function (name, func, helpStr) {
            /*
        [[g;#0ff;transparent]addCommand] adds a command with the given name, that executes the given function 'func'.

        Parameters:
        name: sting
        func: function
        help: string
        */
            commands[name] = window[name] = func;
            if(helpStr) {
                help[name] = helpStr;
            }
        };

        this.removeCommand = function (name) {
            /*
        [[g;#0ff;transparent]removeCommand] Removes a command with the given name.

        Parameters:
        name: string
        */
            delete commands[name];
            delete window[name];
        };

        this.getCommand = function (cmdName) {
            return commands[cmdName];
        };

        this.getCommands = function () {
            return commands;
        };

        this.help = function (cmdName) {
            return help[cmdName] || 'No help available for this command.';
        };

        this['addCommand']('addCommand', this['addCommand'],
            '\n[[g;#0ff;transparent]addCommand(name, func)]\n\nAdds a command to the JavaScript interpreter.\n\n' +
            'Parameters:\n' +
            '   [[g;#ff0;transparent]name]: {string} the name of the command\n' +
            '   [[g;#ff0;transparent]func]: {function} the function that will be called\n');
        this['addCommand']('removeCommand', this['removeCommand'],
            '\n[[g;#0ff;transparent]removeCommand(cmdName)]\n\nRemoves a command from the JavaScript interpreter.\n\n' +
            'Parameters:\n' +
            '   [[g;#ff0;transparent]cmdName]: {string} the name of the command\n');
        this['addCommand']('help', this['help'],
            '\n[[g;#0ff;transparent]help(cmdName)]\n\nYes, that\'s how this command is used.\n\n' +
            'Parameters:\n' +
            '   [[g;#ff0;transparent]cmdName]: {string} the command for which you require help\n');
    };
    return GameScope;
});