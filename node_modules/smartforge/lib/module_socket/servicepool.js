/*!
 * SmartForge - socketservices
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 *
 * Pool of services
 */


var utils = require('../utils.js'),
    collections = require('../collections'),
    application = require('../application'),
    service = require('../application/service.js')
    ;

// ---------------------------------------------------------------------------------------------------------------
//                              public
// ---------------------------------------------------------------------------------------------------------------

function ServicePool(){
    var self = this;

    self._pool = new collections.HashMap(); // channel map of array. key is channel name, value is array of services
}

ServicePool.prototype.getService = function(channelname, servicename){
    var channelArray = this._pool.get(channelname);
    return getService(channelArray, servicename);
};

/**
 * Retrieve or create a Service instance.
 * To add methods to service simply call addMethod(name, function)
 * @param channelname {string} Name of channel
 * @param servicename {string} Name of service
 * @see application.Service
 */
ServicePool.prototype.getOrCreateService = function(channelname, servicename){
    var self = this,
        pool = self._pool;
    if(!pool.contains(channelname)){
        pool.put( channelname, new Array() );
    }
    var channelArray = pool.get(channelname),
        srvc = getService(channelArray, servicename);
    if(null==srvc){
        srvc = new service.Service();
        channelArray.push(srvc);
    }
    return srvc;
};

ServicePool.prototype.addService = function(channelname, service){
    var self = this,
        pool = self._pool,
        servicename = service.name;
    if(!pool.contains(channelname)){
        pool.put( channelname, new Array() );
    }
    var channelArray = pool.get(channelname),
        srvc = getService(channelArray, servicename);
    if(null==srvc){
        srvc = service;
        channelArray.push(srvc);
    }
    return srvc;
};

// ---------------------------------------------------------------------------------------------------------------
//                              private
// ---------------------------------------------------------------------------------------------------------------

function getService(channelArray, servicename){
    if(!utils.isEmpty(channelArray)){
        for(var i=0;i<channelArray.length;i++){
            var service = channelArray[i];
            if(service && servicename===service.name){
                return service;
            }
        }
    }
    return null;
}

// ---------------------------------------------------------------------------------------------------------------
//                              exports
// ---------------------------------------------------------------------------------------------------------------

exports.ServicePool = ServicePool;
exports.newInstance = function(){
  return new ServicePool();
};