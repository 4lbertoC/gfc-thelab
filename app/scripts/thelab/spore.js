define(['gameframework/pubsub'], fuction(pubSub) {
  
  /* Private variables */
  var _hatchTimeout = 3000;
  
  /* Private methods */
  var _addToDom = function(refNode) {
    var sporeNode = document.createElement('div');
    sporeNode.classList.add('spore');
    if(refNode instanceof HTMLElement) {
      refNode.appendChild(sporeNode)
    }
  };
  
  var Spore = function(refNode) {
    this.refNode = refNode;
    
    setTimeout((function(that) {
      that._hatch.call(that);
    })(this), _hatchTimeout);
  };
  Spore.prototype = {
    _hatch: function() {
      _addToDom(this.refNode)
    }
  };
  return Spore;
});