define(['jquery', 'jquery-tinyPubSub'], function ($) {
    'use strict';

    var PubSub = {
        publish: $.publish,
        subscribe: $.subscribe,
        unsubscribe: $.unsubscribe,
        subscribeOnce: function (name, handle, thisObj) {
            var newHandle = function () {
                handle.apply(thisObj, arguments);
                $.unsubscribe(name, newHandle);
            };
            $.subscribe(name, newHandle);
        }
    };
    return PubSub;
});