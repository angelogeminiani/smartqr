/*!
 * SmartForge - request
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 */

var utils = require('../utils.js')
    ;

// ---------------------------------------------------------------------------------------------------------------
//                              CONSTANTS
// ---------------------------------------------------------------------------------------------------------------

var ID = 'id',
    CHANNEL = 'channel',
    SERVICE = 'service',
    METHOD = 'method',
    ARGS = 'args',
    AUTH_TOKEN = 'auth_token',
    DEF_CHANNEL = 'default';

// ---------------------------------------------------------------------------------------------------------------
//                              public
// ---------------------------------------------------------------------------------------------------------------

function Request(textData) {
    this.parse(textData);
}

Request.prototype.toString = function () {
    return this.stringify();
};

Request.prototype.stringify = function () {
    return JSON.stringify(this);
};

Request.prototype.parse = function (textData) {
    var self = this,
        data = textData ? JSON.parse(textData) : {};

    self[ID] = data[ID] || utils.uid();             // (optional) request identifier
    self[CHANNEL] = data[CHANNEL] || DEF_CHANNEL;   // (optional) request channel
    self[SERVICE] = data[SERVICE] || '';            // name of service to call. i.e. 'users'
    self[METHOD] = data[METHOD] || '';              // method of service. i.e. 'getAll'
    self[ARGS] = data[ARGS] || new Array();         // parameters for method.
    self[AUTH_TOKEN] = data[AUTH_TOKEN] || '';      // token for secure methods
};

Request.prototype.isValid = function () {
    var self = this;

    return hasMethod(self);
};

// ---------------------------------------------------------------------------------------------------------------
//                              private
// ---------------------------------------------------------------------------------------------------------------

function hasMethod(self) {
    return (utils.hasText(self[SERVICE]) && utils.hasText(self[METHOD]));
}

// ---------------------------------------------------------------------------------------------------------------
//                              exports
// ---------------------------------------------------------------------------------------------------------------

exports.Request = Request;
exports.newInstance = function (text) {
    return new Request(text);
};