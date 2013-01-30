define(['./entity', 'gameframework/pubsub', 'gameframework/cssutils'], function (Entity, pubSub, cssUtils) {
  'use strict';

  /* Private variables */
  var _baseDna = {
    'aspect': 'http://bdogames.altervista.org/gfc-jsbugslab-static/1359505963_bacteria.png',
    'onCreate': {

    },
    'onRemove': {

    },
    'replicationSpeed': 10000
  };
  var _idCounter = 0;

  /* Private methods */


  /* PubSub */
  pubSub.subscribe('Bugterium/hatch', function (refDomNode, dna) {
    // Add bugteria to dish
  });

  var Bugterium = function (refDomNode, dna, dimensions) {
    if(refDomNode instanceof HTMLElement) {
      this.entity = new Entity();

      this.id = _idCounter++;
      this.dna = dna;

      var bugDomNode = document.createElement('div');
      bugDomNode.classList.add('bug');
      bugDomNode.style.width = dimensions[0] + 'px';
      bugDomNode.style.height = dimensions[1] + 'px';
      bugDomNode.style.background = 'url(' + dna['aspect'] + ') center no-repeat';
      this.entity.addToParent(bugDomNode, refDomNode, dimensions);
    }
  };
  Bugterium.prototype = {};

  /* Static */
  Bugterium.getBaseDna = function () {
    return _baseDna;
  };

  return Bugterium;
});