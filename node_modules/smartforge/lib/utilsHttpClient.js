/*!
 * SmartForge - utilsHttpClient
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 */

(function(){

    var http = require('http'),
        url = require('url'),
        utils = require('./utils.js');


    // --------------------------------------------------------------------------------------------------------------
    //                              public
    // --------------------------------------------------------------------------------------------------------------

    /**
     * Simple Http GET request.
     * @param options {Object}:
     *      - uri
     *      - proxy {string} (Optional) Default null. Proxy address. i.e. 'http://myproxy:8080/'
     *      - encoding {string} (Optional) Default 'utf8'
     * @param callback i.e. function(error, data, response)
     */
    function get(options, callback){
        var uri = validUri(options.uri),
            proxy = options.proxy?validUri(option.proxy):null,
            encoding = options.encoding||'utf8';

        var req_options = {
            host: proxy?proxy.hostname:uri.hostname,
            port: proxy?proxy.port:uri.port||80,
            path: uri.href,
            method: 'GET'
        };

        var request = http.request(req_options, function(response){
            var data = '';
            var error = !(response.statusCode===200)?new Error("Response status code: " + response.statusCode):null;
            //console.log('STATUS: ' + response.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding(encoding);
            response.on('data', function (chunk) {
                // console.log('CHUNK: ' + chunk);
                data+=chunk;
            });
            response.on('end', function () {
                callback(error, data, response);
            });
        });

        request.on('error', function(e) {
            callback(e);
        });

        request.end();
    }

    // --------------------------------------------------------------------------------------------------------------
    //                              private
    // --------------------------------------------------------------------------------------------------------------

    function validUri(urlObject){
        return utils.isString(urlObject)?url.parse(urlObject):urlObject;
    }

    // --------------------------------------------------------------------------------------------------------------
    //                              exports
    // --------------------------------------------------------------------------------------------------------------

    exports.get = get;

})();
