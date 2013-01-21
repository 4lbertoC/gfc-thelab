define(['gameframework/constants', 'gameframework/gamemanager', 'gameframework/pubsub'], function(constants, GameManager, pubSub) {
	'use strict';
	var _gameManager = null;
	var _gameScope = null;

	var TheLabGame = {
		start: function() {
			_gameManager = new GameManager();
			_gameManager.init();

			_gameScope = _gameManager.getTerminalScope();

			var _callbackId = undefined;
	        function _addLabCommands() {
	            pubSub.publish('Terminal/write', ['Lights turned on, activating lab.']);
	            _gameScope['addCommand']('addSeed', function() {
	                game.Food.add.apply(this, arguments);
	            });
	            _gameScope['addCommand']('getMotherDna', function() {
	                return game.Lab.motherDNA;
	            });
	            _gameScope['addCommand']('getBugDna', function() {
	                return game.Lab.bugDNA;
	            });
	            _gameScope['addCommand']('setMotherDna', function(dna) {
	                game.Lab.motherDNA = dna;
	            });
	            _gameScope['addCommand']('setBugDna', function(dna) {
	                return game.Lab.bugDNA = dna;
	            });

	            if(_callbackId)
	            {
	                pubSub.publish('MutationObserver/remove', [_callbackId]);
	            }
	        }
	        pubSub.publish('MutationObserver/add', [constants.JQ_DARKNESS.parent(), _addLabCommands, [{ 'element': '#darkness' }], function(id) {
	            _callbackId = id;
	        }]);
			}
	};
	return TheLabGame;
});