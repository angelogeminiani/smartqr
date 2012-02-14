/*!
 * SmartForge - service
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 *
 * Is a pool of functions.
 * Each Service can have one or more functions assigned.
 */

/**
 * Module Dependencies
 */
var utils = require('../utils.js')
    ;

// ---------------------------------------------------------------------------------------------------------------
//                              CONSTANTS
// ---------------------------------------------------------------------------------------------------------------

var ID = 'id',
    NAME = 'name',
    DEF_NAME = 'default';

// ---------------------------------------------------------------------------------------------------------------
//                              public
// ---------------------------------------------------------------------------------------------------------------

function Service(name) {
    var self = this;

    self[ID] = utils.uid();         // identifier
    self[NAME] = name||DEF_NAME;    // name of service

    self._functions = new Array();
}

/**
 * Add a method to service
 * @param name {string}
 * @param func {function}
 */
Service.prototype.addMethod = function (name, func) {
    if (utils.hasText(name) && utils.isFunction(func)) {
        this[name] = func;
    }
};

/**
 * Returns true if service contains the method
 * @param name {string} Name of Method
 */
Service.prototype.hasMethod = function (name) {
    if ( utils.hasText(name) ) {
        return utils.isFunction (this[name]);
    }
    return false;
};

/**
 * Execute a service
 * @param name {string} function name
 * @param argsArray {array} Array of parameters to pass to function
 * @param callback {function} i.e. function(err, result)
 */
Service.prototype.execute = function (name, argsArray, callback) {
    var self = this;
    utils.defer(function(){
        var error = null,
            result = null;
        try{
            if (utils.hasText(name)) {
                if (utils.isFunction(self[name])) {
                    result = apply(self, name, argsArray);
                }
            }
        } catch(err){
            error = err;
        }
        if(utils.isFunction(callback)){
            callback.call(self, error, result);
        }
    });
};

// ---------------------------------------------------------------------------------------------------------------
//                              private
// ---------------------------------------------------------------------------------------------------------------

function apply(self, name, argsArray){
    var result;
    if (utils.isEmpty(argsArray)) {
        result = self[name].apply(self);
    } else {
        result = self[name].apply(self, argsArray);
    }
    return result;
}

// ---------------------------------------------------------------------------------------------------------------
//                              exports
// ---------------------------------------------------------------------------------------------------------------

exports.Service = Service;
exports.newInstance = function (name) {
    return new Service(name);
};