define([], function() {
	
	var GameScope = function() {
        var commands = {};

        this.addCommand = function(name, func) {
            /*
        [[g;#0ff;transparent]addCommand] adds a command with the given name, that executes the given function 'func'.

        Parameters:
        name: sting
        func: function
        */
            commands[name] = window[name] = func;
        };

        this.removeCommand = function(name) {
            /*
        [[g;#0ff;transparent]removeCommand] Removes a command with the given name.

        Parameters:
        name: string
        */
            delete commands[name];
            delete window[name];
        };

        this.getCommand = function(cmdName) {
            return commands[cmdName];
        };

        this.getCommands = function() {
            return commands;
        };

        this['addCommand']('addCommand', this['addCommand']);
        this['addCommand']('removeCommand', this['removeCommand']);
    };
    return GameScope;
});