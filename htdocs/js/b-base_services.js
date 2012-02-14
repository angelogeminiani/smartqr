
(function(window, B, $, undefined) { 
    
    // ------------------------------------------------------------------------
    //                      services (ajax call)
    //                      
    //                      depends:
    //                          b.base.js
    //                      uses:
    //                          sf-base_i18n.js
    // ------------------------------------------------------------------------
    
    //-- generic service --//
    B.services = B.services||{};
    
    B.DEF_TOKEN = "rO0ABXQAOTIvQkVFaW5nLzN8YWRtaW5pc3RyYXRvcnwyMDBDRUIyNjgwN0Q2QkY5OUZENkY0RjBE%0AMUNBNTRENA%3D%3D";
    
    B.services.parseLang = function(lang){
        return B.i18n.language(lang);
    };

    /**
     * Call remote service.
     * @param {Object} objArgs Object containig all arguments. 
     * i.e. { endpoint, data{}, response, error, before, after }
     **/
    B.services.call = function ( /* object */objArgs ) {
        var method = "POST",
        url = objArgs.endpoint.concat(objArgs.methodname),
        params = B.toQueryString(objArgs.data),
        funcSuccess = objArgs.response,
        funcError = objArgs.error,
        funcBefore = objArgs.before,
        funcAfter = objArgs.after;

        // invoke ajax method
        if($){
            $.ajax({
                type: method,
                url: url,
                data: params,
                success: function (data, textStatus, jqXHR) {
                    if(funcSuccess){
                        try{
                            if(data){
                                if(data.jtype==="error"){
                                    throw new Error(data.jmessage);
                                } else {
                                    if(data.jvalue){
                                        funcSuccess(B.toObject(data.jvalue));
                                    } else {
                                        funcSuccess(data);
                                    }
                                }
                            } else {
                                throw new Error("No response!");
                            }
                        }catch(err){
                            funcSuccess(err);
                        } 
                    }
                },
                error: function (jqXHR, textStatus, errorThrown){
                    // connection error
                    if(funcError){
                        funcError(errorThrown);
                    }
                },
                beforeSend: function (){
                    if(funcBefore){
                        funcBefore();
                    }
                },
                complete: function () {
                    if(funcAfter){
                        funcAfter();
                    }
                }
            });
        } else {
            // unable to invoke! missing jQuery
            B.log("jQuery is not installed!");
        }
    };
    
    // ------------------------------------------------------------------------
    //                      CUSTOM SERVICES
    // Custom services must be declared in separated files (plugins). 
    // Separate declaration allow to load services only where needed.
    // Declare a service like this:
    // (function(B){
    //      B.services.mynamespace = {}; // service namespace
    //      B.services.mynamespace.ENDPOINT = "/rest2/myendpointpath";
    //      B.services.mynamespace.mymethod = function (/*...*/) {};
    // })(B);                     
    // ------------------------------------------------------------------------

    
    
})(window, beeing, jQuery); 
