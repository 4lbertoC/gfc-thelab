define(['jquery', './entity', 'gameframework/constants', 'gameframework/pubsub'], function ($, Entity, constants, pubSub) {
  'use strict';

  /* Private variables */
  var _baseDna = {
    'aspect': 'http://res.cloudinary.com/albertoc/image/upload/w_64,h_64/bacteria.png',
    'replicationSpeed': 5000
  };
  var _idCounter = 0;
  var _idPrefix = 'bugterium_';

  var s_instances = {};

  /* Private methods */


  /* PubSub */
  pubSub.subscribe('Bugterium/hatch', function (refDomNode, dna) {
    // Add bugteria to dish
  });

  var Bugterium = function (refDomNode, dna, dimensions) {
    if(refDomNode instanceof HTMLElement) {
      this.entity = new Entity();

      var idNum = _idCounter++;
      this.id = _idPrefix + idNum;
      this.dna = dna;
      this.dimensions = dimensions;

      var bugDomNode = document.createElement('div');
      bugDomNode.classList.add('bug');
      bugDomNode.id = this.id;
      bugDomNode.style.width = dimensions[0] + 'px';
      bugDomNode.style.height = dimensions[1] + 'px';
      $(bugDomNode).show('scale');
      bugDomNode.style.background = 'url(' + dna['aspect'] + ') center no-repeat';

      var tag = document.createElement('span');
      tag.classList.add('bugTag');
      $(tag).text(idNum);
      bugDomNode.appendChild(tag);
      this.entity.addToParent(bugDomNode, refDomNode, dimensions);

      setTimeout(function () {
        $(bugDomNode).css({
          'transform': $(bugDomNode).css('transform') + ' rotateZ(' + (500 + Math.random() * 360) + 'deg)'
        });
      }, 100);
      this.domNode = bugDomNode;

      s_instances[this.id] = this;
    }
  };
  Bugterium.prototype = {
    getId: function () {
      return this.id;
    },
    getDimensions: function () {
      var w = this.domNode.offsetWidth;
      var h = this.domNode.offsetHeight;
      return [w, h];
    },
    moveTo: function (refDomNodeId, margins, callback) {
      var bugNode = this.domNode;
      var refDomNode = document.getElementById(refDomNodeId);
      var thisBug = this;
      if(bugNode && (bugNode.parentElement instanceof HTMLElement)) {
        var futurePosition = this.entity.calculatePositionInParent(refDomNode, thisBug.getDimensions(), margins);
        if(futurePosition[0] === -1) {
          callback && callback('failure');
          return;
        } else {
          var jqBugNode = $(bugNode);
          jqBugNode.hide('puff', {
            complete: function () {
              jqBugNode.remove();
              thisBug.entity.addToParent(bugNode, refDomNode, thisBug.getDimensions(), margins);
              jqBugNode.show('drop', {
                direction: 'top',
                complete: function () {
                  pubSub.publish('AudioManager/playSound', [constants.Sound.BUG]);
                  callback && callback('success');
                }
              });
            }
          });
        }
      }
    }
  };

  /* Static */
  Bugterium.getBaseDna = function () {
    return _baseDna;
  };
  Bugterium.getById = function (bugId) {
    if(typeof bugId === 'string' && bugId.indexOf(_idPrefix) > -1) {
      return s_instances[bugId];
    }
    return s_instances[_idPrefix + bugId];
  };

  return Bugterium;
});