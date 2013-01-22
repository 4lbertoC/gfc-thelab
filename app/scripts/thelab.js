define(['gameframework/constants', 'gameframework/gamemanager', 'gameframework/pubsub'], function(constants, GameManager, pubSub) {
    'use strict';

    /* Private variables */
    var _gameManager = null;
    var _gameScope = null;

    /* Private methods */
    var _addDarknessCallback = function() {
        // Runs when the darkness disappears, activating the lab commands.
        var _callbackId;

        function _addLabCommands() {
            pubSub.publish('Terminal/write', ['Lights turned on, activating lab.']);
            _gameScope.addCommand('addSeed', function() {
                // TODO
            });
            _gameScope.addCommand('getMotherDna', function() {
                // TODO
            });
            _gameScope.addCommand('getBugDna', function() {
                // TODO
            });
            _gameScope.addCommand('setMotherDna', function(dna) {
                // TODO
            });
            _gameScope.addCommand('setBugDna', function(dna) {
                // TODO
            });

            if (_callbackId) {
                pubSub.publish('MutationObserver/remove', [_callbackId]);
            }
        }
        pubSub.publish('MutationObserver/add', [constants.JQ_DARKNESS.parent(), _addLabCommands, [{
            'element': '#darkness'
        }], function(id) {
            _callbackId = id;
        }]);
    };

    var _initVars = function() {
        _gameManager = new GameManager();
        _gameManager.init();
        _gameScope = _gameManager.getTerminalScope();
    };

    var TheLabGame = {
        start: function() {
            _initVars();
            // TODO
            // Create dish and flask here or create them in the html
            // Create bacteria's classes
            _addDarknessCallback();
        }
    };
    return TheLabGame;
});
