define(['jquery', './constants', './pubsub'], function ($, constants, pubSub) {
    'use strict';

    /* Private variables */
    var _achievements = {};
    var _achievementTooltipTimeout = 3000;
    var _points = 0;
    var _achievementDomNode = null;
    var _hintsCount = 0;

    var _achievementCallbacks = {
        'bug_captured': function () {
            _showTooltip('<b>+50</b> Gotcha!');
            pubSub.publish('UI/talk', ['Great job!', constants.Text.HINTS_PERSON_NAME, constants.Text.BUG_CAPTURED]);
            _points += 50;
        },
        'darkness_removed': function () {
            _showTooltip('<b>+50</b> Lights on');
            pubSub.publish('UI/talk', ['Great job!', constants.Text.HINTS_PERSON_NAME, constants.Text.LIGHTS_ON_ALERT]);
            _points += 50;
        },
        'bug_grown': function () {
            _showTooltip('<b>+50</b> firstChild');
            _points += 50;
        },
        'glass_repaired': function () {
            _showTooltip('<b>+50</b> Disaster prevented');
            _points += 50;
        },
        'collect_10_bugs': function () {
            _showTooltip('<b>+100</b> Mission accomplished');
            _points += 100;
        },
        'logged_in': function () {
            _showTooltip('<b>+50</b> Inside the system');
            _points += 50;
        },
        'game_over. yes, this is an achievement': function () {
            _showTooltip('<b>+49</b> Game over...?');
            _points += 49;
        },
        'invisible_bug': function () {
            _points += 50;
        },
        'virus_bug': function () {
            _points += 50;
        },
        'bigger_bug': function () {
            _points += 50;
        },
        'inhibited_bug': function () {
            _points += 50;
        },
        'mutated_bug': function () {
            _points += 50;
        }
    };

    /* Private methods */
    var _getAchievementCount = function () {
        var i = 0;
        for(var a in _achievements) {
            i++;
        }
        return i;
    };

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

    var _update = function () {
        var achievementTxt = '';
        var achievementCount = 0;
        for(var a in _achievements) {
            achievementTxt += a + '<br />';
            achievementCount++;
        }
        var totAchievementCount = 0;
        for(var b in _achievementCallbacks) {
            totAchievementCount++;
        }
        for(var i = totAchievementCount - achievementCount; i > 0; i--) {
            achievementTxt += '??? <br />';
        }
        constants.JQ_ACHIEVEMENT_LIST.html(achievementTxt);
        constants.JQ_POINTS.html('' + _points);
    };

    /* PubSub */
    pubSub.subscribe('AchievementManager/achieve', function (evt, name) {
        if(!_achievements[name]) {
            _achievements[name] = true;
            pubSub.publish('AudioManager/playSound', [constants.Sound.SUCCESS]);
            if(_achievementCallbacks[name]) {
                _achievementCallbacks[name]();
            }
            if(window.localStorage) {
                window.localStorage.setItem('achievements', JSON.stringify(_achievements));
                window.localStorage.setItem('points', JSON.stringify(_points));
            }
            _update();
            window._gaq.push(['_trackEvent', 'Game', 'Achievement', name, _getAchievementCount()]);
        }
    });

    pubSub.subscribe('AchievementManager/openSpoiler', function () {
        _hintsCount++;
        _points -= 10;
        pubSub.publish('AudioManager/playSound', [constants.Sound.FAILURE]);
        _update();
        var hintRequested = '';
        if(constants.Text.I_AM_STUCK_TEXT === constants.Text.HINT_DARKNESS) {
            hintRequested = 'cannot_remove_darkness';
        } else if(constants.Text.I_AM_STUCK_TEXT === constants.Text.HINT_GROW_BUGTERIA) {
            hintRequested = 'cannot_grow_bug';
        } else if(constants.Text.I_AM_STUCK_TEXT === constants.Text.HINT_BUGTERIUM_TOO_BIG) {
            hintRequested = 'cannot_move_bug_to_flask';
        } else if(constants.Text.I_AM_STUCK_TEXT === constants.Text.HINT_BUGTERIUM_IN_FLASK) {
            hintRequested = 'cannot_collect_10_bugs';
        }
        window._gaq.push(['_trackEvent', 'Menu', 'Hints', hintRequested, _getAchievementCount()]);
    });

    pubSub.subscribe('AchievementManager/update', _update);

    var AchievementManager = function () {};
    AchievementManager.prototype = {
        getAchievementCount: function () {
            return _getAchievementCount();
        },
        getGivenHintsCount: function () {
            return _hintsCount;
        },
        getPoints: function () {
            return _points;
        },
        getTotalAchievementCount: function () {
            var i = 0;
            for(var a in _achievementCallbacks) {
                i++;
            }
            return i;
        },
        init: function () {
            _achievementDomNode = document.createElement('div');
            _achievementDomNode.classList.add('achievementNode');

            var tmpAchievements, tmpPoints;
            if(window.localStorage) {
                if(tmpAchievements = window.localStorage.getItem('achievements')) {
                    _achievements = JSON.parse(tmpAchievements);
                }
                if(tmpPoints = window.localStorage.getItem('points')) {
                    _points = parseInt(tmpPoints);
                }
            }
        }
    };
    return AchievementManager;
});