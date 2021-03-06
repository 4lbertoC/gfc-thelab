define(['jquery', './constants', './pubsub'], function ($, constants, pubSub) {
    'use strict';

    var _mutationObserverArray = {};

    var MutationObserver = function () {};
    MutationObserver.prototype = {
        init: function () {
            var that = this; /* PubSub */
            pubSub.subscribe('MutationObserver/add', function (evt, node, observerCallback, query, callback) {
                var id = that.addObserver(node, observerCallback, query);
                if(typeof callback === 'function') {
                    callback(id);
                }
            });
            pubSub.subscribe('MutationObserver/remove', function (evt, node, id) {
                that.removeObserver(node, id);
            });
            pubSub.subscribe('MutationObserver/removeAll', function (evt, node) {
                that.removeAllObservers(node);
            });
        },

        addObserver: function (node, callback, query) {
            var observer = [node, callback, query];
            var nodeObserverArray = _mutationObserverArray[node] || [];
            nodeObserverArray.push(observer);
            $(node).mutationSummary('connect', callback, query);
            return(nodeObserverArray.length - 1);
        },

        removeAllObservers: function (node) {
            if(_mutationObserverArray[node] instanceof Array) {
                _mutationObserverArray[node] = null;
            }
            $(node).mutationSummary('disconnect');
        },

        removeObserver: function (node, id) {
            var nodeObserverArray = _mutationObserverArray[node];
            if((nodeObserverArray instanceof Array) && (nodeObserverArray.length > id) && (nodeObserverArray[id] instanceof Array)) {
                var callback = nodeObserverArray[id].callback;
                var query = nodeObserverArray[id].query;
                $(node).mutationSummary('disconnect', callback, query);
                _mutationObserverArray[node][id] = null;
            }
        }
    };
    return MutationObserver;

});