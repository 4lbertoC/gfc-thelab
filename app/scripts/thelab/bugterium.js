define([], fuction() {
  
  /* Private variables */
  var _baseDna = {
    'onCreate': {
      
    },
    'onRemove': {
      
    },
    'replicationSpeed': 10000
  };
  
  var Bugterium = function(){};
  Bugterium.prototype = {
    getBaseDna: function() {
      return _baseDna;
    }
  };
  return Bugterium;
});