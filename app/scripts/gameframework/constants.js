define(['jquery', './pubsub'], function ($, pubSub) {
    'use strict';

    var constants = {};

    constants.APP_NAME = 'The Lab';

    constants.CODEMIRROR_ELEMENT = document.getElementById('myCodeMirror');

    constants.getJQ_HELP_BUTTONS = function () {
        return $('.helpButton');
    };

    constants.getJQ_LINKS = function () {
        return $('.link');
    };

    constants.getJQ_ACCORDIONS = function () {
        return $('.anAccordion');
    };

    constants.CLASS_BROKEN = 'broken';

    constants.ID_DESK = 'desk';

    constants.ID_DISH = 'dish';

    constants.ID_FLASK = 'flask';

    constants.ID_GLASS = 'glass';

    constants.JQ_ACHIEVEMENT_LIST = $('#achievementList');

    constants.JQ_POINTS = $('#points');

    constants.JQ_TERMINAL = $('.gfcTerminal');

    constants.JQ_CODE = $('.code');

    constants.JQ_DARKNESS = $('#darkness');

    constants.JQ_DESK = $('#' + constants.ID_DESK);

    constants.JQ_DISH = $('#' + constants.ID_DISH);

    constants.JQ_FLASK = $('#' + constants.ID_FLASK);

    constants.JQ_GLASS = $('#' + constants.ID_GLASS);

    constants.JQ_MENU = $('.menu');

    constants.JQ_I_AM_STUCK = $('#iAmStuck');

    constants.JQ_JSDIALOG = $('.jsEditor');

    constants.JQ_MSGDIALOG = $('.msgDialog');

    constants.JQ_MUSIC_TOGGLE = $('#musicToggle');

    constants.JQ_TERMINAL_TOGGLE = $('.terminalToggle');

    constants.JQ_SOUND_TOGGLE = $('#soundToggle');

    constants.JQ_MENU_BUTTON = $('.menuButton');

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

    constants.Sound.BUG = 'bug';

    constants.Sound.SPORE = 'spore';

    constants.Sound.VIRUS = 'virus';

    constants.Sound.GLASS_BREAK = 'glass_broken';

    constants.Sound.GAME_OVER = 'game_over';

    constants.Sound.SCREAM = 'scream';

    constants.Text = {};

    constants.Text.LIGHTS_BROKEN = '[[g;#f00;transparent]ERROR: light() function seems to be broken. Please use Javascript interpreter to fix it.]';

    constants.Text.GREETINGS = '[ ' + constants.APP_NAME + ' ]\nType [[g;#0ff;transparent]help] for commands.\n';
    constants.Text.HELP = 'Available commands:\n' +
        '[[g;#0ff;transparent]help]: display this page.\n' +
        '[[g;#0ff;transparent]js]: run javascript interpreter.\n' +
        '[[g;#0ff;transparent]light]: turn on the light.\n' +
        '\n' +
        'When using the Javascript interpreter, use [[g;#0ff;transparent]exit] or [[g;#ff0;transparent]CTRL+D] to go back to the menu.';

    constants.Text.HINT_LOGIN = '<p>Uh-oh! It looks like you need to enter the credentials to log into the terminal.';

    constants.Text.HINT_JSTERMINAL = '<p>You just entered the JavaScript terminal. One the first line you can see the available commands, ' +
        'type <span class="funcStr">printCommands()</span> to show them again.' +
        '<p>All these commands are in fact JavaScript functions, so if you write their name without the ending parenthesis you will see their body.' +
        '<p>The <span class="funcStr">editCode(\'command-name\')</span> function is a tool you can use to compose new functions and objects more easily.' +
        '<p>Use <span class="funcStr">addCommand(\'name\', command)</span> and <span class="funcStr">removeCommand(\'command\')</span> to create your custom commands.' +
        '<p>Use <span class="funcStr">help(\'name\')</span> to get information on how to use a command.' +
        '<p><span onclick="window.open(\'https://developer.mozilla.org/docs/JavaScript/Guide/Functions\')"' +
        'target="_blank" class="helpButton">Functions</span>' +
        '<p><div class="anAccordion"><h3>Example</h3><div>' +
        '<p>Call <span class="funcStr">editCode()</span>, and the edit window will appear. Here write the following code:<p>' +
        '<div class="code codeStr">function() { alert("hi"); }</div><p>Then press Ok. If you now call <span class="funcStr">result()</span>' +
        ' you will see the dialog appear.<br>' +
        'You can then type <span class="funcStr">addCommand(\'sayHello\', result)</span> to save the result object as a command.' +
        '</div></div><p>';

    constants.Text.TUTORIAL_INTRO = '<p>Welcome to Games for Coders - ' + constants.APP_NAME + '!<p style="color: red;">WARNING: This is not a common videogame: ' +
        'you will have to code in JavaScript and manipulate the DOM to solve it.</p><p style="color: orange">' +
        'WARNING2: It is still a prototype and some features could be broken or not implemented.</p>' +
        '<p>In order to play, you can either use the in-game terminal or your browser\'s developer tools.</p>' +
        '<p>If you are stuck at some point, you can find some hints by going into the game menu.</p>';

    constants.Text.HINT_DARKNESS = '<p>The first thing you should do in order to play is remove the <span class="divText">darkness</span>.</p>' +
        '<p>As I said, this is not a game like others you see around, you\'ll have to CODE if you want to go on. For example, ' +
        'there is no button that turns on the lights!' +
        '<p>When you see a name colored like <span class="divText">glass</span>, I am referring to a ' +
        '<span onclick="window.open(\'https://developer.mozilla.org/docs/DOM/HTMLElement\')"' +
        'target="_blank" class="helpButton">HTMLElement</span> ID. You will have to put your hands on ' +
        'JavaScript and the DOM, so if you are new to the topic you\'d better keep some ' +
        '<span onclick="window.open(\'https://developer.mozilla.org/\')"' +
        'target="_blank" class="helpButton">documentation</span> at your side.</p>';

    constants.Text.HINT_GROW_BUGTERIA = '<p>Now that you can see the <span class="divText">dish</span> and the <span class="divText">flask</span>, you can ' +
        'use the commands that crete the bugteria.</p><p>The command <span class="funcStr">addSpore()</span> will add a spore on the dish, from which one or more bugteria will spawn. ' +
        'Take a look also at <span class="funcStr">getBaseDna()</span> too, as it is a place you can use to modify the bugteria before creating them.</p>' +
        '<p>You can pass the modified dna as input to the spore creation, calling <span class="funcStr">addSpore(dna)</span></p>';

    constants.Text.HINT_BUGTERIUM_TOO_BIG = '<p>If you have problems moving the bugteria to the flask, try modifying their dna. As you can see, an url to an image is ' +
    'provided as the <i>aspect</i> parameter. Try to modify the dna by passing a smaller image.</p>';

    constants.Text.HINT_BUGTERIUM_IN_FLASK = '<p>Well done, you successfully moved a bugterium to the flask. Now you just have to collect 10 of them.';

    constants.Text.WRONG_PARAMS_EDITCODE = '<p>You are calling <span class="funcStr">editCode()</span> with the wrong parameters. The function takes as input the name of the command that you want to edit, ' +
        'or nothing if you want to create a new function that will be stored in the variable called <i>result</i>.</p>';

    constants.Text.WRONG_PARAMS_ADDSPORE = '<p>You are calling <span class="funcStr">addSpore()</span> with the wrong parameters. You should either call it without parameters or' +
    'provide a dna as first parameter.</p><p>Use <span class="funcStr">help(\'commandName\')</span> to get more help.</p>';

    constants.Text.WRONG_PARAMS_MOVETOFLASK = '<p>The bug with the given id cannot be found.</p><p>You are probably calling <span class="funcStr">moveToFlask()</span> with the wrong parameters. You should provide the ' +
    'bugterium\'s id, which you can see on the tag on top of it.</p><p>Use <span class="funcStr">help(\'commandName\')</span> to get more help.</p>';

    constants.Text.LIGHTS_ON_TERMINAL = '[[;#fff;transparent]LIGHTS TURNED ON, ACTIVATING LAB...]\n[[g;#0ff;transparent]addSpore(dna)][[;#fff;transparent]...] [[g;#0f0;transparent]ACTIVE]' +
        '\n[[g;#0ff;transparent]cleanDish()][[;#fff;transparent].....] [[g;#f00;transparent]BROKEN]' +
        '\n[[g;#0ff;transparent]getBaseDna()][[;#fff;transparent]...] [[g;#0f0;transparent]ACTIVE]' +
        '\n[[g;#0ff;transparent]moveToFlask(bugId)][[;#fff;transparent]...] [[g;#0f0;transparent]ACTIVE]';

    constants.Text.LIGHTS_ON_ALERT = '<p>You did it! Now it\'s easier for me to explain what we have here and what we need you to do.</p>' +
        '<p>We are in a <b>Bugterium Laboratory</b>.</p><p>Here we study <b>bugteria</b>, an interesting new form of digital microorganism that has been recently discovered. ' +
        'The platform we have here is very powerful: we can manipulate their DNA and create custom <b>bugteria</b>! ...unfortunately someone hacked our system and ' +
        'broke it, and it cannot be fixed.</p><p>The only way to make it work is through the terminal using that javascript stuff, but we don\'t know how to use it. ' +
        'Do you think you could help us?</p>' +
        '<p>The big plate you see on the table is a ' +
        '<span class="link" onclick="window.open(\'http://en.wikipedia.org/wiki/Petri_dish\')" target="_blank">Petri <span class="divText">dish</span></span>. Here is where <b>bugteria</b> should grow.</p>' +
        '<p>The other small container is a <span class="link" onclick="window.open(\'http://en.wikipedia.org/wiki/Laboratory_flask\')" target="_blank"><span class="divText">flask</span></span>. ' +
        'It\'s where bugterial specimen should be collected for analysis.</p>' +
        '' +
        '<p style="margin: 5px auto; text-align: center; color: red; font-size: 1.2em; font-weight: bold;">Collect 10 bugteria!</p>' +
        '<p>Feel free to experiment with their DNA, more variety for the analysis could give us more interesting results!</p>' +
        '<p>Oh and, please, don\'t remove the <span class="divText">glass</span>. We don\'t want the bugteria to escape, right?</p>';

    constants.Text.ISANYONETHERE_MESSAGE = '<p>Hello, uhh... I know it\'s dark here, it can sound strange but I have no idea how to turn the lights on.</p>' +
        '<p>I tried using the terminal but it is broken, could you give a look? Maybe you know more javascript than me...</p>';

    constants.Text.GLASS_REMOVED = 'Oh no! The <span class="divText">glass</span> is not covering the desk anymore and the bugteria can escape!!!';

    constants.Text.GLASS_BROKEN = 'Oooops... the <span class="divText">glass</span> is broken, it looks dangerous...';

    constants.Text.GLASS_REPAIRED = 'Wow, the <span class="divText">glass</span> is repaired!';

    constants.Text.BUGTERIUM_TOO_BIG = 'It looks like that bugterium is too big to fit into the flask. You should find a way to make it smaller.';

    constants.Text.COLLECT_10_BUGS = '<p>YOU DID IT!</p><p>You collected 10 bugs, shall we proceed with the analysis?';

    constants.Text.HINTS_PERSON_NAME = 'Someone in the dark';

    constants.Text.BUG_CAPTURED = 'Well done, you collected your fist bug!';

    constants.Text.I_AM_STUCK_TEXT = constants.Text.HINT_DARKNESS;

    constants.Text.CLEAN_DISH_BROKEN = '<p>Watch out, the <span class="funcStr">cleanDish()</span> command is broken! You should try editing its code ' +
    'with <span class="funcStr">editCode()</span> so that it in fact clears the dish.';

    constants.Text.DISH_OVERFLOW_WARNING = '<p>Be careful, the dish is getting overcrowded. You should remove some of the bugteria from the dish. ' +
        '</p><p>I think this is a good time to fix the <span class="funcStr">cleanDish()</span> command, unless you know some other way to remove them...</p>';

    constants.Text.INVASION_WARNING = '<p>OMG, WE CANNOT STOP THEM!!! QUICK, REFRESH THE PAGE!!!</p>';

    constants.Assets = {};

    constants.Assets.VIRUS = 'https://d3jpl91pxevbkh.cloudfront.net/albertoc/image/upload/v1360409934/virus.png';

    constants.Text.BUG_PREVIOUSLY_ESCAPED = '<p>Hello again! Please, this time try to be more careful, and I\'ll pretend that nothing happened.</p>';

    constants.Text.BUG_ON_DESK = '<p>Please be careful, a bugterium just came out of the dish. You can recognise that from the yellow circle that appeared around it.</p>';

    constants.Text.VIRUS_APPEARED = '<p>The situation is getting critical, the bugteria are mutating into something else!!!</p>';

    constants.Buttons = {};
    constants.Buttons.getDefaultCloseButton = function() {
        var btn = {
            text: 'Close',
            click: function() {
                $(this).dialog('close');
                pubSub.publish('AudioManager/playSound', [constants.Sound.DIALOG_BUTTON]);
            }
        };
        return btn;
    };

    return constants;
});