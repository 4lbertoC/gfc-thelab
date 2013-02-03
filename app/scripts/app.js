'use strict';
define(['jquery', 'gameframework/utils', 'thelab'], function ($, utils, TheLab) {
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
				'http://res.cloudinary.com/albertoc/image/upload/v1359756143/pill.png',
				'https://d3jpl91pxevbkh.cloudfront.net/albertoc/image/upload/v1359755516/bacteria.png'
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