define(['jquery', './bugterium', './entity', 'gameframework/pubsub', 'gameframework/utils'], function ($, Bugterium, Entity, pubSub, utils) {
  'use strict';

  /* Private variables */
  var _hatchTimeout = 3000;
  var _minMaxBugteriaCreated = [1, 4];
  var _baseDna = Bugterium.getBaseDna();
  var _baseDnaImageSize = null;
  var _sporeDimension = null;

  /* Private methods */
  var _getNumberOfCreatedBugteria = function () {
    return Math.ceil((_minMaxBugteriaCreated[0] - 1) + (Math.random() * (_minMaxBugteriaCreated[1] - (_minMaxBugteriaCreated[0] - 1))));
  };

  /* Initialization */
  (function () {
    utils.preloadImage(_baseDna['aspect'], function (status, dimensions) {
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
        sporeNode.style.display = 'none';
        this.entity.addToParent(sporeNode, refDomNode, [64, 64]);
        $(sporeNode).show('scale');

        utils.preloadImage(dna['aspect'], function (status, dimensions) {
          if(status === 'error') {
            dna['aspect'] = _baseDna['aspect'];
            dimensions = _baseDnaImageSize;
          }
          setTimeout(function () {
            pubSub.publish('Bugterium/hatch', []);
            if(sporeNode.parentElement === refDomNode) {
              $(sporeNode).hide({
                effect: 'expode',
                complete: function () {
                  refDomNode.removeChild(sporeNode);
                }
              });
              var numBugteria = _getNumberOfCreatedBugteria();
              while(numBugteria > 0) {
                new Bugterium(refDomNode, dna, dimensions);
                --numBugteria;
              }
            }
          }, _hatchTimeout);
        });
      }
    }
  };
  return Spore;
});