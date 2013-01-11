define(['jquery', './constants', './pubsub'], function($, constants, pubsub) {
	
	/* Private methods */
	var _darknessMutationObserverCallback = function(summaries) {
		(summaries && (typeof summaries === 'object') && (typeof summaries[0] === 'object') && (typeof summaries[0].removed[0] === 'object') &&
			(typeof summaries[0].removed[0] === 'object') && summaries[0].removed[0]['id'] === 'darkness') && pubsub.publish('GameEvent/darknessRemoved');
		alert('Darkness removed!');
		// TODO Also display = none or width = 0 or height = 0 would work
	};

	return {
		init: function() {
			constants.JQ_DARKNESS.parent().mutationSummary('connect', _darknessMutationObserverCallback, [{ 'element': '#darkness' }])
		}
	}

});