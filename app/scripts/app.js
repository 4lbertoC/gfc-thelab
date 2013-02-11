'use strict';
define(['jquery', 'gameframework/constants', 'gameframework/utils', 'thelab'], function ($, constants, utils, TheLab) {
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
			utils.preloadImages([
				constants.Assets.BUGTERIUM,
				constants.Assets.VIRUS
				], function () {
				TheLab.start(function () {
					loadText.text('Done!');
					loadText.css({
						transform: 'translate3d(0%,100px,0)'
					});
				});
			});
		}
	};
});