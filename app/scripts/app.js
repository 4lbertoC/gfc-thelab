'use strict';
define(['gameframework/gamemanager', 'thelab'], function(GameManager, TheLab) {
  return {
	init: function() {
		TheLab.start(new GameManager());
	}
  };
});