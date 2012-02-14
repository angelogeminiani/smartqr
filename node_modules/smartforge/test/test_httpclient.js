/*!
 * SmartForge - 
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 */

var assert = require('assert'),
    client = require('../lib/utilsHttpClient.js');

var options = {
    uri: 'http://www.google.it'
}

client.get(options, function(error, data, response){
    console.log('DATA: ' + data);
    //console.log(response);
});

client.get(
    {
        uri: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=false',
        signed:false
    },
    function(error, data, response){
    console.log('DATA: ' + data);
    //console.log(response);
});