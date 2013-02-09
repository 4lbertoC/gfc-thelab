define(['module', 'buzz', './constants', './pubsub'], function (module, buzz, constants, pubSub) {
    'use strict';

    /* Constants */
    var MUSIC_DIR = 'music/';
    var SOUND_DIR = 'sound/';

    /* Private variables */
    var _isEnabledMusic = module.config().enableMusic;
    var _isEnabledSound = module.config().enableSound;

    var _musicLoop = new buzz.group([
        new buzz.sound(MUSIC_DIR + 'Hidden%20Agenda.ogg'),
        new buzz.sound(MUSIC_DIR + 'Smoking%20Gun.ogg')]).setPlaybackMode('chain');
    var _musicGameOver = new buzz.sound(MUSIC_DIR + 'Danse Macabre - Low Strings Finale.ogg');
    var _soundDialogShow = new buzz.sound(SOUND_DIR + 'swosh.ogg');
    var _soundDialogButton = new buzz.sound(SOUND_DIR + 'button-12.ogg');
    var _soundAccordion = new buzz.sound(SOUND_DIR + 'bird-1-a.ogg');
    var _soundArrayKeyboard = new buzz.group([
        new buzz.sound(SOUND_DIR + 'key0.ogg'),
        new buzz.sound(SOUND_DIR + 'key1.ogg'),
        new buzz.sound(SOUND_DIR + 'key2.ogg'),
        new buzz.sound(SOUND_DIR + 'key3.ogg'),
        new buzz.sound(SOUND_DIR + 'key4.ogg'),
        new buzz.sound(SOUND_DIR + 'key5.ogg'),
        new buzz.sound(SOUND_DIR + 'key6.ogg'),
        new buzz.sound(SOUND_DIR + 'key7.ogg'),
        new buzz.sound(SOUND_DIR + 'key8.ogg'),
        new buzz.sound(SOUND_DIR + 'key9.ogg'),
        new buzz.sound(SOUND_DIR + 'key10.ogg'),
        new buzz.sound(SOUND_DIR + 'key11.ogg')]).setPlaybackMode('random');
    var _soundArrayTerminal = [
        new buzz.group([
        new buzz.sound(SOUND_DIR + 'button-on.ogg'),
        new buzz.sound(SOUND_DIR + 'sliding-04.ogg'),
        new buzz.sound(SOUND_DIR + 'button-9.ogg')]).load(),
        new buzz.group([
        new buzz.sound(SOUND_DIR + 'button-on.ogg'),
        new buzz.sound(SOUND_DIR + 'sliding-03.ogg'),
        new buzz.sound(SOUND_DIR + 'exit-sound.ogg')]).load()];
    var _soundFailure = new buzz.sound(SOUND_DIR + 'cartoon-bing-low.ogg');
    var _soundSpoiler = new buzz.sound(SOUND_DIR + 'tom.ogg');
    var _soundSuccess = new buzz.sound(SOUND_DIR + 'success-1.ogg');
    var _soundGlassBreak = new buzz.sound(SOUND_DIR + 'mp-glass-break.ogg');
    var _soundScream = new buzz.sound(SOUND_DIR + 'male.ogg');
    var _soundBug = new buzz.group([
        new buzz.sound(SOUND_DIR + 'cartoon-poppyup-appearances-0001.ogg'),
        new buzz.sound(SOUND_DIR + 'cartoon-poppyup-appearances-0002.ogg'),
        new buzz.sound(SOUND_DIR + 'cartoon-poppyup-appearances-0003.ogg'),
        new buzz.sound(SOUND_DIR + 'cartoon-poppyup-appearances-0004.ogg'),
        new buzz.sound(SOUND_DIR + 'cartoon-poppyup-appearances-0005.ogg'),
        ]).setPlaybackMode('random');
    var _soundSpore = new buzz.sound(SOUND_DIR + 'jaw-harp9.ogg');
    var _soundVirus = new buzz.sound(SOUND_DIR + 'cartoon-bubbles.ogg');

    /* PubSub */
    pubSub.subscribe('AudioManager/playSound', function (evt, soundName) {
        if(!_isEnabledSound) {
            return;
        }
        if(soundName === constants.Sound.KEYBOARD) {
            _soundArrayKeyboard.play();
        } else if(soundName === constants.Sound.TERMINAL_ON) {
            _soundArrayTerminal[0].play();
        } else if(soundName === constants.Sound.TERMINAL_OFF) {
            _soundArrayTerminal[1].play();
        } else if(soundName === constants.Sound.DIALOG_SHOW) {
            _soundDialogShow.play();
        } else if(soundName === constants.Sound.DIALOG_BUTTON) {
            _soundDialogButton.play();
        } else if(soundName === constants.Sound.ACCORDION) {
            _soundAccordion.play();
        } else if(soundName === constants.Sound.SUCCESS) {
            _soundSuccess.play();
        } else if(soundName === constants.Sound.FAILURE) {
            _soundFailure.play();
        } else if(soundName === constants.Sound.SPOILER) {
            _soundSpoiler.play();
        } else if(soundName === constants.Sound.BUG) {
            _soundBug.play();
        } else if(soundName === constants.Sound.SPORE) {
            _soundSpore.play();
        } else if(soundName === constants.Sound.VIRUS) {
            _soundVirus.play();
        } else if(soundName === constants.Sound.GLASS_BREAK) {
            _soundGlassBreak.play();
        } else if(soundName === constants.Sound.SCREAM) {
            _soundScream.play();
        } else if(soundName === constants.Sound.GAME_OVER) {
            _musicLoop.stop();
            _musicGameOver.play();
        }
    });

    var AudioManager = function () {};
    AudioManager.prototype = {
        enableMusic: function (enable) {
            _isEnabledMusic = enable;
            if(_isEnabledMusic) {
                constants.JQ_MUSIC_TOGGLE.button({
                    icons: {
                        primary: 'ui-icon-volume-on'
                    },
                    label: 'Music'
                });
                _musicLoop.play().loop();
            } else {
                constants.JQ_MUSIC_TOGGLE.button({
                    icons: {
                        primary: 'ui-icon-volume-off'
                    },
                    label: 'Music'
                });
                _musicLoop.stop();
            }
        },

        enableSound: function (enable) {
            _isEnabledSound = enable;
            if(_isEnabledSound) {
                constants.JQ_SOUND_TOGGLE.button({
                    icons: {
                        primary: 'ui-icon-volume-on'
                    },
                    label: 'Sound'
                });
            } else {
                constants.JQ_SOUND_TOGGLE.button({
                    icons: {
                        primary: 'ui-icon-volume-off'
                    },
                    label: 'Sound'
                });
            }
        },

        toggleMusic: function () {
            this.enableMusic(!_isEnabledMusic);
        },

        toggleSound: function () {
            this.enableSound(!_isEnabledSound);
        },

        init: function () {
            this.enableMusic(_isEnabledMusic);
            this.enableSound(_isEnabledSound);
        }
    };
    return AudioManager;
});