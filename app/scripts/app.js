'use strict';
define(['jquery', 'gameframework/gamemanager', 'thelab'], function ($, GameManager, TheLab) {
	return {
		init: function () {
			var loadText = $('#loadText');
			var loadCurtain = $('#loadCurtain');
			loadText.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
				loadText.hide();
				loadCurtain.css({
					transform: 'translate3d(-120%,0%,0)'
				});
				return false;
			});
			loadCurtain.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
				loadText.remove();
				loadCurtain.remove();
			});
			TheLab.start(function () {
				loadText.css({
					transform: 'translate3d(0%,100px,0)'
				});
			});
		}
	};
});