define([], function() {
	'use strict';

	var constants = {};

	constants.CODEMIRROR_ELEMENT = document.getElementById('myCodeMirror');

	constants.getJQ_HELP_BUTTONS = function() {
		return $('.helpButton');
	};

	constants.getJQ_LINKS = function() {
		return $('.link');
	};

	constants.getJQ_ACCORDIONS = function() {
		return $('.anAccordion');
	};

	constants.JQ_BUGS_TERMINAL = $('.bugsTerminal');

	constants.JQ_CODE = $('.code');

	constants.JQ_DARKNESS = $('#darkness');

	constants.JQ_FAQ_CONTENT = $('#faqContent');

	constants.JQ_I_AM_STUCK = $('#iAmStuck');

	constants.JQ_JSDIALOG = $('.jsEditor');

	constants.JQ_MSGDIALOG = $('.msgDialog');

	constants.JQ_MUSIC_TOGGLE = $('#musicToggle');

	constants.JQ_TERMINAL_TOGGLE = $('.terminalToggle');

	constants.JQ_SOUND_TOGGLE = $('#soundToggle');

	constants.JQ_TITLE_OVERLAY = $('.titleOverlay');

	constants.Achievement = {};

	constants.Achievement.LOGGED_IN = 'logged_in';

	constants.Sound = {};

	constants.Sound.ACCORDION = 'accordion';

	constants.Sound.DIALOG_BUTTON = 'dialog_button';

	constants.Sound.DIALOG_SHOW = 'dialog_show';

	constants.Sound.FAILURE = 'failure';

	constants.Sound.KEYBOARD = 'keyboard';

	constants.Sound.SUCCESS = 'success';

	constants.Sound.TERMINAL_ON = 'terminal_on';

	constants.Sound.TERMINAL_OFF = 'terminal_off';

	constants.Text = {};

	constants.Text.LIGHTS_BROKEN = '[[g;#f00;transparent]ERROR: light() function seems to be broken. Please use Javascript interpreter to fix it.]';

	constants.Text.GREETINGS = '[ JS Bugs Lab v2.0 ]\nType [[g;#0ff;transparent]help] for commands.\n';

	constants.Text.HELP = 'Available commands:\n' +
		'[[g;#0ff;transparent]help]: display this page.\n' +
		'[[g;#0ff;transparent]js]: run javascript interpreter.\n' +
		'[[g;#0ff;transparent]light]: turn on the light.\n' +
		'\n' +
		'When using the Javascript interpreter, use [[g;#0ff;transparent]exit] or [[g;#ff0;transparent]CTRL+D] to go back to the menu.';

	constants.Text.HINT_LOGIN = '<p>Uh-oh! It looks like you need ' +
						'to enter the credentials to log into the terminal.';

	constants.Text.HINT_JSTERMINAL = '<p>You just entered the JavaScript terminal. You can see the available commands ' +
		'listed above the prompt, or type <span class="funcStr">printCommands()</span> to show them again.' +
		'<p>All these commands are in fact JavaScript functions, so if you write their name without the ending parenthesis you will see their body ' +
		'(some of them have documentation too).' +
		'<p>The <span class="funcStr">editCode()</span> function is a tool you can use to compose new functions and objects more easily.' +
		'<p>Use <span class="funcStr">addCommand()</span> and <span class="funcStr">removeCommand()</span> to create your custom commands ' +
		'(and again, type without parenthesis to see how to use them).' +
		'<p><span onclick="window.open(\'https://developer.mozilla.org/docs/JavaScript/Guide/Functions\')"' +
			'target="_blank" class="helpButton">Functions</span>' +
		'<p><div class="anAccordion"><h3>Example</h3><div>' +
		'<p>Call <span class="funcStr">editCode()</span>, and the edit window will appear. Here write the following code:<p>' +
		'<div class="code codeStr">function() { alert("hi"); }</div><p>Then press Ok. If you now call <span class="funcStr">result()</span>' +
		' you will see the dialog appear.<br>' +
		'You can then type <span class="funcStr">addCommand("sayHello", result)</span> to save the result into the commands.' +
		'</div></div><p>';

	constants.Text.TUTORIAL_INTRO = '<p>Welcome to JS Bugs Lab 2.0!<p style="color: red;">WARNING: This is not a common videogame: ' +
		'you will have to code in JavaScript and manipulate the DOM to solve it.</p>' +
		'<p><i>Normal</i> mode is preferred if you have some knowledge of JavaScript and programming in general. If you have none, it could be VERY difficult. ' +
		'Choose this mode also if you don\'t like situations in which you have no idea what to do: JavaScript has a lot of functions and rules, ' +
		'and if you are not used to them, the solution might not be very straightforward.' +
		'<p><i>Difficult</i> mode won\'t display any advice at all. Choose this if you have been playing around with the browser\'s developer tools for a while, ' +
		'and if you feel like racking your brains on the game code.' +
		'<p>So, what mode do you prefer?';

	constants.Text.HINT_DARKNESS = '<p>The first thing you should do in order to play is remove the <span class="divText">darkness</span>.</p>' +
			'<p>As I said, this is not a game like others you see around, you\'ll have to CODE if you want to go on. For example,' +
			'there is no button that turns on the lights!' +
			'<p>When you see a name colored in red in these messages, like <span class="divText">glass</span>, we are referring to a ' +
		 	'<span onclick="window.open(\'https://developer.mozilla.org/docs/DOM/HTMLElement\')"' +
			'target="_blank" class="helpButton">HTMLElement</span> ID. You will find yourself playing with ' +
			'JavaScript and the DOM, so if you are new to the topic you\'d better keep some ' +
			'<span onclick="window.open(\'https://developer.mozilla.org/\')"' +
			'target="_blank" class="helpButton">documentation</span> at your side.</p>';

	return constants;
});