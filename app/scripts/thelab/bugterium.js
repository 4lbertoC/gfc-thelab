define(['gameframework/pubsub', 'gameframework/cssutils'], function (pubSub, cssUtils) {
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
  var _marginLeft = 45;
  var _marginTop = 30;
  var _marginRight = 50;
  var _marginBottom = 35;

  /* Private methods */
  var _calculatePositionInParent = function (refDomNode, dimensions) {
    /*
      Return [-1, -1] if the bugterium is too big for its container.
    */
    if(refDomNode instanceof HTMLElement) {
      var w = refDomNode.offsetWidth;
      var h = refDomNode.offsetHeight;
      var maxX = w - dimensions[0] - _marginRight;
      var maxY = h - dimensions[1] - _marginBottom;
      if(maxX < _marginLeft || maxY < _marginTop) {
        return [-1, -1];
      }
      var x = _marginLeft + (Math.random() * maxX);
      var y = _marginTop + (Math.random() * maxY);
      return [x, y];
    } else {
      return [];
    }
  };


  /* PubSub */
  pubSub.subscribe('Bugterium/hatch', function (refDomNode, dna) {
    // Add bugteria to dish
  });

  var Bugterium = function (refDomNode, dna, dimensions) {
    if(refDomNode instanceof HTMLElement) {
      this.id = _idCounter++;
      this.dna = dna;

      var bugDomNode = document.createElement('div');
      bugDomNode.classList.add('bug');
      if(dimensions instanceof Array && dimensions.lenght > 1) {
        bugDomNode.style.width = dimensions[0];
        bugDomNode.style.height = dimensions[1];
        
        var position = _calculatePositionInParent(refDomNode, dimensions);
        if(position.length > 0) {
          if(position[0] === -1) {
            // Bugterium comes out of the glass!
          }
          else {
            bugDomNode.style.left = position[0];
            bugDomNode.style.top = position[1];
          }
        }
      }
      bugDomNode.style.background = 'url(' + dna['aspect'] + ') center no-repeat';
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