define([], function () {
	'use strict';

	var _preloadedImages = {};

	var Utils = {
		preloadImage: function (imageUrl, callback) {
			var preloadedImage = _preloadedImages[imageUrl];
			if(preloadedImage instanceof Array) {
				callback('ok', preloadedImage);
			} else if(typeof imageUrl === 'string') {
				var imgDomNode = document.createElement('img');
				imgDomNode.style.display = 'none';
				imgDomNode.onload = function () {
					var dimensions = [imgDomNode.naturalWidth, imgDomNode.naturalHeight];
					_preloadedImages[imageUrl] = dimensions;
					var refDomNode = imgDomNode.parentElement;
					if(refDomNode instanceof HTMLElement) {
						refDomNode.removeChild(imgDomNode);
					}
					if(typeof callback === 'function') {
						callback('ok', dimensions);
					}
				};
				imgDomNode.onerror = function () {
					var refDomNode = imgDomNode.parentElement;
					if(refDomNode instanceof HTMLElement) {
						refDomNode.removeChild(imgDomNode);
					}
					if(typeof callback === 'function') {
						callback('error');
					}
				};
				imgDomNode.src = imageUrl;
				document.body.appendChild(imgDomNode);
			}
		},
		preloadImages: function (imageUrlArray, callback) {
			if(imageUrlArray instanceof Array) {
				var loadedImageCount = 0;
				var arrayLen = imageUrlArray.length;
				var imgCallback = function () {
					loadedImageCount++;
					if(loadedImageCount >= arrayLen && callback) {
						callback();
					}
				};
				for(var i = 0; i < arrayLen; i++) {
					Utils.preloadImage(imageUrlArray[i], imgCallback);
				}
			}
		}
	};
	return Utils;

});