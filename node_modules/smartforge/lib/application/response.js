/*!
 * SmartForge - response
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 *
 * Generic Service response wrapper.
 * Used both in HTTP REST services and Socket services.
 */

var utils = require('../utils.js')
    ;

// ---------------------------------------------------------------------------------------------------------------
//                              CONSTANTS
// ---------------------------------------------------------------------------------------------------------------

var ID = 'id',
    RESPONSE = 'response', // assigned only if error occurred for debug purpose
    REQUEST = 'request',
    ERROR = 'error',
    CHANNEL = 'channel',
    SERVICE= 'service',
    METHOD = 'method';

// ---------------------------------------------------------------------------------------------------------------
//                              public
// ---------------------------------------------------------------------------------------------------------------

function Response(options){
    var self = this;

    if(options){
        self[ID] = options[ID]||utils.uid();
        self[ERROR] = options[ERROR]?options[ERROR].toString():null;
        self[CHANNEL] = options[CHANNEL];
        if(options[REQUEST]){
            self[ID] = options[REQUEST][ID]||self[ID];
            self[CHANNEL] = options[REQUEST][CHANNEL]||self[CHANNEL];
            self[SERVICE] = options[REQUEST][SERVICE]||self[SERVICE];
            self[METHOD] = options[REQUEST][METHOD]||self[METHOD];
            if(utils.hasText(self[ERROR])){
                self[REQUEST] = options[REQUEST];
            }
        }
        self[RESPONSE] = options[RESPONSE];
    }
}

Response.prototype.toString = function () {
    return this.stringify();
};

Response.prototype.stringify = function () {
    return JSON.stringify(this);
};

// ---------------------------------------------------------------------------------------------------------------
//                              exports
// ---------------------------------------------------------------------------------------------------------------

exports.Response = Response;
exports.newInstance = function(options){
    return new Response(options);
};