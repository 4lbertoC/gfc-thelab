define(['gameframework/pubsub'], function (pubSub) {

  /* Private variables */
  var _baseDna = {
    'onCreate': {

    },
    'onRemove': {

    },
    'replicationSpeed': 10000
  };

  /* PubSub */
  pubSub.subscribe('Bugterium/hatch', function(refDomNode, dna) {
    // Add bugteria to dish
  });

  var Bugterium = function () {};
  Bugterium.prototype = {
    getBaseDna: function () {
      return _baseDna;
    }
  };
  return Bugterium;
});