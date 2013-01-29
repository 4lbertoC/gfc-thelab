define(['gameframework/pubsub'], function (pubSub) {
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

  /* PubSub */
  pubSub.subscribe('Bugterium/hatch', function (refDomNode, dna) {
    // Add bugteria to dish
  });

  var Bugterium = function (refDomNode, dna) {
    this.id = _idCounter++;
    this.dna = dna;

    var bugDomNode = document.createElement('div');
    bugDomNode.classList.add('bug');
    bugDomNode.style.background = 'url(' + dna['aspect'] + ') center no-repeat';
    if(refDomNode instanceof HTMLElement) {
      refDomNode.appendChild(bugDomNode);
    }
  };
  Bugterium.prototype = {};

  /* Static */
  Bugterium.getBaseDna = function () {
    return _baseDna;
  };

  return Bugterium;
});