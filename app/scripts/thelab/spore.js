define(['./bugterium', 'gameframework/pubsub'], function (Bugterium, pubSub) {
  'use strict';

  /* Private variables */
  var _hatchTimeout = 3000;
  var _minMaxBugteriaCreated = [1, 4];
  var _baseDna = Bugterium.getBaseDna();
  var _baseDnaImageSize = null;
  var _preloadedImages = {};

  /* Private methods */
  var _getNumberOfCreatedBugteria = function () {
    return Math.ceil((_minMaxBugteriaCreated[0] - 1) + (Math.random() * (_minMaxBugteriaCreated[1] - (_minMaxBugteriaCreated[0] - 1))));
  };

  var _preloadImage = function (imageUrl, callback) {
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
  };

  /* Initialization */
  _preloadImage(_baseDna['aspect'], function(status, dimensions) {
      _baseDnaImageSize = (status === 'ok') ? dimensions : [64, 64];
  });

  var Spore = function (refDomNode, dna) {
    this.refDomNode = refDomNode;
    this.dna = dna || _baseDna;

    this._hatch(this.dna);
  };
  Spore.prototype = {
    _hatch: function (dna) {
      var refDomNode = document.getElementById(this.refDomNode);
      if(refDomNode instanceof HTMLElement) {
        var sporeNode = document.createElement('div');
        sporeNode.classList.add('spore');
        refDomNode.appendChild(sporeNode);

        _preloadImage(dna['aspect'], function (status, dimensions) {
          if(status === 'error') {
            dna['aspect'] = _baseDna['aspect'];
            dimensions = _baseDnaImageSize;
          }
          setTimeout(function () {
            pubSub.publish('Bugterium/hatch', []);
            if(sporeNode.parentElement === refDomNode) {
              refDomNode.removeChild(sporeNode);
            }
            var numBugteria = _getNumberOfCreatedBugteria();
            while(numBugteria > 0) {
              new Bugterium(refDomNode, dna);
              --numBugteria;
            }
          }, _hatchTimeout);
        });
      }
    }
  };
  return Spore;
});