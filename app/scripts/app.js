define(['gameframework/gamemanager', 'jsbugslab'], function(gameManager, jsbugslab) {
  return {
  	init: function() {
  		jsbugslab.run();
  		gameManager.init();
  	}
  };
});