define(['./constants', './pubsub'], function (constants, pubSub) {
    'use strict';

    /* Private variables */
    var _achievements = {};
    var _achievementTooltipTimeout = 3000;
    var _points = 0;

    var _achievementCallbacks = {
        'bug_captured': function () {
            pubSub.publish('UI/talk', ['Great job!', constants.Text.HINTS_PERSON_NAME, constants.Text.BUG_CAPTURED]);
            constants.Text.I_AM_STUCK_TEXT = constants.Text.HINT_BUGTERIUM_IN_FLASK;
        },
        'darkness_removed': function() {
            pubSub.publish('UI/talk', ['Great job!', constants.Text.HINTS_PERSON_NAME, constants.Text.LIGHTS_ON_ALERT]);
            constants.Text.I_AM_STUCK_TEXT = constants.Text.HINT_GROW_BUGTERIA;
        },
        'bug_grown': function() {
            constants.Text.I_AM_STUCK_TEXT = constants.Text.HINT_BUGTERIUM_TOO_BIG;
        }
    };

    _achievements[constants.Achievement.LOGGED_IN] = false;

    /* PubSub */
    pubSub.subscribe('AchievementManager/achieve', function (evt, name) {
        if(!_achievements[name]) {
            _achievements[name] = true;
            pubSub.publish('AudioManager/playSound', [constants.Sound.SUCCESS]);
            if(_achievementCallbacks[name]) {
                _achievementCallbacks[name]();
            }
        }
    });

    pubSub.subscribe('AchievementManager/openSpoiler', function () {
        _points -= 10;
        pubSub.publish('AudioManager/playSound', [constants.Sound.FAILURE]);
    });

    return {
        init: function () {

        }
    };
});