define(['jquery', './constants', './pubsub'], function ($, constants, pubSub) {
    'use strict';

    /* Private variables */
    var _achievements = {};
    var _achievementTooltipTimeout = 3000;
    var _points = 0;
    var _achievementDomNode = null;

    /* Private methods */
    var _showTooltip = function (text) {
        var jqNode = $(_achievementDomNode);
        jqNode.html(text);
        document.body.appendChild(_achievementDomNode);
        setTimeout(function () {
            jqNode.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                setTimeout(function () {
                    if(_achievementDomNode.parentElement) {
                        jqNode.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                            document.body.removeChild(_achievementDomNode);
                        });
                        _achievementDomNode.classList.remove('achievementNodeShown');
                    }
                }, _achievementTooltipTimeout);
            });
            _achievementDomNode.classList.add('achievementNodeShown');
        }, 1);
    };

    var _achievementCallbacks = {
        'bug_captured': function () {
            _showTooltip('<b>+50</b> Gotcha!');
            pubSub.publish('UI/talk', ['Great job!', constants.Text.HINTS_PERSON_NAME, constants.Text.BUG_CAPTURED]);
            constants.Text.I_AM_STUCK_TEXT = constants.Text.HINT_BUGTERIUM_IN_FLASK;
        },
        'darkness_removed': function () {
            _showTooltip('<b>+50</b> Lights on');
            pubSub.publish('UI/talk', ['Great job!', constants.Text.HINTS_PERSON_NAME, constants.Text.LIGHTS_ON_ALERT]);
            constants.Text.I_AM_STUCK_TEXT = constants.Text.HINT_GROW_BUGTERIA;
        },
        'bug_grown': function () {
            _showTooltip('<b>+50</b> firstChild');
            constants.Text.I_AM_STUCK_TEXT = constants.Text.HINT_BUGTERIUM_TOO_BIG;
        },
        'glass_repaired': function() {
            _showTooltip('<b>+50</b> Disaster prevented');
        },
        'collect_10_bugs': function() {
            _showTooltip('<b>+100</b> Mission accomplished');
        },
        'logged_in': function() {
            _showTooltip('<b>+50</b> Inside the system');
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

    var AchievementManager = function () {};
    AchievementManager.prototype = {
        init: function () {
            _achievementDomNode = document.createElement('div');
            _achievementDomNode.classList.add('achievementNode');
        }
    };
    return AchievementManager;
});