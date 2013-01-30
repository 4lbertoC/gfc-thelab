define(['./bugterium', './entity', 'gameframework/pubsub'], function (Bugterium, Entity, pubSub) {
  'use strict';

  /* Private variables */
  var _hatchTimeout = 3000;
  var _minMaxBugteriaCreated = [1, 4];
  var _baseDna = Bugterium.getBaseDna();
  var _baseDnaImageSize = null;
  var _preloadedImages = {};
  var _sporeDimension = null;

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
  (function () {
    _preloadImage(_baseDna['aspect'], function (status, dimensions) {
      _baseDnaImageSize = (status === 'ok') ? dimensions : [64, 64];
    });

    // function getStyle(className) {
    //   var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
    //   var theClass = null;
    //   for(var x = 0; x < classes.length; x++) {
    //     if(classes[x].selectorText === className) {
    //       theClass = (classes[x].cssText) ? alertclasses[x].cssText) : alert(classes[x].style.cssText);
    //     }
    //   }
    // }
    // var sporeStyle = getStyle('spore');
    // _sporeDimension = [parseInt(sporeStyle.width), parseInt(sporeStyle.height)];
    })();

  var Spore = function (refDomNode, dna) {
    this.entity = new Entity();

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
        this.entity.addToParent(sporeNode, refDomNode, [64, 64]);

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
              new Bugterium(refDomNode, dna, dimensions);
              --numBugteria;
            }
          }, _hatchTimeout);
        });
      }
    }
  };
  return Spore;
  });