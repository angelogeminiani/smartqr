/*!
 * SmartForge - echo
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 *
 * Sample echo service.
 * This service is just a simple echo that returns back client the request.
 */


var utils = require('../../utils.js'),
    application = require('../../application');

// ---------------------------------------------------------------------------------------------------------------
//                              CONSTANTS
// ---------------------------------------------------------------------------------------------------------------

var NAME = 'echo',
    METHOD_ECHO = 'echo';

// ---------------------------------------------------------------------------------------------------------------
//                              public
// ---------------------------------------------------------------------------------------------------------------

function EchoService(){
    var self = this;

    this.name = NAME;

    // methods
    this.addMethod(METHOD_ECHO, function(socket, connection, request, message){
        return echo(self, socket, connection, request, message);
    });
}
// extends application.Service
utils.inherits(EchoService, application.Service);

// ---------------------------------------------------------------------------------------------------------------
//                              private
// ---------------------------------------------------------------------------------------------------------------

function echo(self, socket, connection, request, message){
    console.log('ECHO: ' + message);
    return message;
}

// ---------------------------------------------------------------------------------------------------------------
//                              exports
// ---------------------------------------------------------------------------------------------------------------

exports.EchoService = EchoService;
exports.newInstance = function(){
    return new EchoService();
};