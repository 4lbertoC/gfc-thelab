define([], function() {

// <NO-INDENT>
// This region is kept with minimal indentation so that it's easier to read the functions on the terminal

var cmd_editCode = function(obj) {
    /*
        [[g;#0ff;transparent]editCode] lets you edit the piece of javascript code provided as input, and stores the result in the global variable 'result'. The parameter obj can be null.

        Parameters:
        obj: Object|Function|null
    */
    _editCode(obj);
});

var cmd_printCommands = function(obj) {
    /*
        [[g;#0ff;transparent]printCommands] shows the available commands.

        Parameters:
        - none -
    */
    _printCommands();
});

var cmd_light =  function() {
    /*
        ERROR INITIALIZING METHOD
    */
    var _ = doc*m3%T.g3tE13m3n73y1d('darkness');
    _.p42en7E1&wEnt.re3ovecHi1D(_);
});

// </NO-INDENT>

	return {
		addCommands: function(scope) {
			_scope.addCommand('editCode', cmd_editCode);
			_scope.addCommand('printCommands', cmd_printCommands);
			_scope.addCommand('light', cmd_printCommands);
		},

		init: function(term) {

		}
	}
});