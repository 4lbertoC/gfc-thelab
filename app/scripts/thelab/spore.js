define(['gameframework/pubsub'], function (pubSub) {
  'use strict';

  /* Private variables */
  var _hatchTimeout = 3000;

  var Spore = function (refNode, dna) {
    this.refNode = refNode;
    this.dna = dna;

    this._hatch(dna);
  };
  Spore.prototype = {
    _hatch: function (dna) {
      var refDomNode = document.getElementById(this.refNode);
      if(refDomNode instanceof HTMLElement) {
        var sporeNode = document.createElement('div');
        sporeNode.classList.add('spore');
        refDomNode.appendChild(sporeNode);

        setTimeout(function () {
          pubSub.publish('Bugterium/hatch', [refDomNode, dna]);
          if(sporeNode.parentElement === refDomNode) {
            refDomNode.removeChild(sporeNode);
          }
        }, _hatchTimeout);
      }
    }
  };
  return Spore;
});