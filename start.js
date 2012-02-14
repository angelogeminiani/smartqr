/**
 *  QR-PARADISE.
 *  Remap QR links to destination links.
 */

/**
 * Module dependencies
 */
var smartforge = require('smartforge')
    , utilsFs = global.SF.utilsFs
    , middleware = global.SF.middleware
    , application = global.SF.application
    ;


// --------------------------------------------------------------------------------------------------------------
//                              initialization
// --------------------------------------------------------------------------------------------------------------




// --------------------------------------------------------------------------------------------------------------
//                              smart server initialization
// --------------------------------------------------------------------------------------------------------------

var smartserver = new smartforge.SmartServer(
    {
        dirname: __dirname
        ,debug:false
    });

var redirSettings = smartserver.settings.redirections.redirect301;

smartserver.addMiddleware(middleware.redirect301({redirmap:redirSettings}));

application.info(redirSettings);

//-- start server --//
smartserver.open();