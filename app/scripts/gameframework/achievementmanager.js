define(['./constants', './pubsub'], function (constants, pubSub) {
    'use strict';

    /* Private variables */
    var _achievements = {};
    var _achievementTooltipTimeout = 3000;
    var _points = 0;

    _achievements[constants.Achievement.LOGGED_IN] = false;

    /* PubSub */
    pubSub.subscribe('AchievementManager/achieve', function (name) {
        _achievements[name] = true;
        pubSub.publish('AudioManager/playSound', [constants.Sound.SUCCESS]);
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