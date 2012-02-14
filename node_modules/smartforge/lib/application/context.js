/*!
 * SmartForge - application
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 */

var utils = require('../utils.js');

// --------------------------------------------------------------------------------------------------------------
//                              public
// --------------------------------------------------------------------------------------------------------------

function Context(){
    var self = this;

    self._sharedObjects = {};
}

/**
 * Remove context variable setting to null.
 * @param name {string} Name of variable
 */
Context.prototype.remove = function(name){
    if(utils.hasText(name)){
        this._sharedObjects[name] = null;
    }
};

/**
 * Add a context variable if its value is not null.
 * @param name {string} Name of variable
 * @param object
 */
Context.prototype.add = function(name, object){
    if(utils.hasText(name) && null!=object){
        this._sharedObjects[name] = object;
    }
};

/**
 * Returns context variable value.
 * @param name {string} Name of variable
 */
Context.prototype.get = function(name){
    if(utils.hasText(name)){
        return this._sharedObjects[name];
    }
    return null;
};

// --------------------------------------------------------------------------------------------------------------
//                              exports
// --------------------------------------------------------------------------------------------------------------

exports.Context = Context;
exports.newInstance = function (){
    return new Context();
}