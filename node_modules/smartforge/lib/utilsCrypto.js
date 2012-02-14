/*!
 * SmartForge - utilsCrypto
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 */
(function () {

    /**
     * Module dependencies.
     */
    var crypto = require('crypto');

    // --------------------------------------------------------------------------------------------------------------
    //                              public
    // --------------------------------------------------------------------------------------------------------------

    /**
     * Return md5 hash of the given string and optional encoding,
     * defaulting to hex.
     *
     *     utils.md5('hello');
     *     // => "e493298061761236c96b02ea6aa8a2ad"
     *
     * @param {String} str
     * @param {String} encoding
     * @return {String}
     * @api public
     */
    function md5(str, encoding) {
        return crypto
            .createHash('md5')
            .update(str)
            .digest(encoding || 'hex');
    }

    function sha1_base64(data) {
        return crypto
            .createHash('sha1')
            .update(data)
            .digest('base64');
    }

    function hmac_base64(data, password) {
        return crypto
            .createHmac('sha1', password)
            .update(data)
            .digest('base64');
    }

    function encode_base64(text){
        return new Buffer(text).toString('base64');
    }

    function decode_base64(text){
        return new Buffer(text, 'base64').toString('ascii');
    }

    // --------------------------------------------------------------------------------------------------------------
    //                              exports
    // --------------------------------------------------------------------------------------------------------------

    exports.md5 = md5;
    exports.sha1_base64 = sha1_base64;
    exports.hmac_base64 = hmac_base64;
    exports.encode_base64 = encode_base64;
    exports.decode_base64 = decode_base64;

})();