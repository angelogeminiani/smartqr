/*!
 * SmartForge - clientpool
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 *
 * Pool of client connections organized by channel (or end-point).
 * A Channel is an end-point (i.e. '/socket') that respond to client calls.
 */

/**
 * Module Dependencies
 */
var collections = require('../collections'),
    utils = require('../utils.js');

// ---------------------------------------------------------------------------------------------------------------
//                              CONSTANTS
// ---------------------------------------------------------------------------------------------------------------

var DEF_CHANNEL = 'default';

// ---------------------------------------------------------------------------------------------------------------
//                              public
// ---------------------------------------------------------------------------------------------------------------

function ClientPool() {
    var self = this;

    self._pool = new collections.HashMap();
}

/**
 * Returns Array of string with names of channels
 */
ClientPool.prototype.getChannels = function(){
    return this._pool.keys();
}

/**
 * Returns Array of connections
 * @param channelName {string} Channel Name. i.e. '[/]socket'
 */
ClientPool.prototype.get = function(channelName){
    return this._pool.get(channelName||DEF_CHANNEL);
}

ClientPool.prototype.add = function (connection) {
    var self = this,
        endpoint = connection.prefix || DEF_CHANNEL,
        channelPool = getOrCreate(self, endpoint);
    utils.defer(function () {
        // add to container, no duplicates
        addToContainer(self, channelPool, connection);
    });
};

ClientPool.prototype.remove = function (connection) {
    var self = this,
        endpoint = connection.prefix || 'default',
        channelPool = getOrCreate(self, endpoint);
    utils.defer(function () {
        // add to container, no duplicates
        removeFromContainer(self, channelPool, connection);
    });
};

// ---------------------------------------------------------------------------------------------------------------
//                              private
// ---------------------------------------------------------------------------------------------------------------

function getOrCreate(self, endpoint) {
    var pool = self._pool;

    if (!pool.contains(endpoint)) {
        pool.put(endpoint, new Array());
    }
    return pool.get(endpoint);
}

function addToContainer(self, container, connection) {
    if (container) {
        var connectionId = connection.id;
        getFromContainer(self, container, connectionId, function (conn) {
            if (null == conn) {
                container.push(connection);
            }
        });
    }
}

function removeFromContainer(self, container, connection) {
    if (container && container.length > 0) {
        var connectionId = connection.id;
        for (var i = container.length - 1; i > -1; i--) {
            var connection = container[i];
            if (connection && connection.id === connectionId) {
                container.splice(i, 1);
                // continue due duplicates
            }
        }
    }
}

function getFromContainer(self, container, connectionId, callback) {
    if (utils.isFunction(callback)) {
        if (container && container.length > 0) {
            for (var i = 0; i < container.length; i++) {
                var connection = container[i];
                if (connection && connection.id === connectionId) {
                    callback(connection);
                    return;
                }
            }
        }
        callback(null);
    }
}

// ---------------------------------------------------------------------------------------------------------------
//                              exports
// ---------------------------------------------------------------------------------------------------------------

exports.ClientPool = ClientPool;
exports.newInstance = function () {
    return new ClientPool();
};