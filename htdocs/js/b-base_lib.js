
(function(window, B, $, undefined) { 
    
    // ------------------------------------------------------------------------
    //                      LIBRARY LOAD
    //                      
    //                      dependencies:
    //                          sf-base.js
    //                          sf-base_loaders.js
    //                      uses:
    //                          
    // ------------------------------------------------------------------------
    
    /**
     * Singleton pattern (MODULE PATTERN)
     * see: http://www.yuiblog.com/blog/2007/06/12/module-pattern/
     */
    B.lib = B.lib||(function(){
        var _libs = new Array();
        
        function getKey(filename){
            var result = B.replaceAll(filename, "/", " ").trim();
            return B.replaceAll(result, " ", "_");
        }
        
        function notExists(filename){
            return _libs.indexOf(getKey(filename))===-1;
        }
        
        function addLib(filename){
            _libs.push(getKey(filename));
        }
        
        return {    // public
            /**
             * Load file library (js, css) and flag as loaded
             */
            require : function(/*string*/ filename){
                try{
                    if( notExists(filename) ){
                        // load lib
                        if(B.endsWith(filename, ".js")){
                            B.script.load(filename);
                        } else if (B.endsWith(filename, ".css")){
                            B.css.load(filename);
                        } else {
                            throw "Unsupported file type: " + filename;
                        }
                        // add to _libs
                        addLib(filename);
                    }
                }catch(err){
                    // throw "Unespected error: " + err;
                    B.error(err);
                }
            },
            
            /**
             * Does not load a library, but flag it as already loaded.
             * This is useful for debug porpouse, when libraries are loaded
             * explicitely from HTML declarations.
             **/
            loaded: function(filename){
                try{
                    if( notExists(filename) ){
                        // add to _libs
                        addLib(filename);
                    }
                }catch(err){
                    //throw "Unespected error: " + err;
                    B.error(err);
                }
            }
        }
    })();
        
    
    // ------------------------------------------------------------------------
    //                      Helpers
    // ------------------------------------------------------------------------
    
    /**
     * JQuery DatePicker helper method to load localizations
     */
    B.lib.datepicker = B.lib.datepicker||{};
    B.lib.datepicker.regional = function (opt_lang){
        var 
        langCode = opt_lang||B.lang,
        url ="http://jquery-ui.googlecode.com/svn/trunk/ui/i18n/jquery.ui.datepicker-"+langCode+".js" ;
        B.lib.require(url);
    }
    
})(window, beeing, jQuery); 
