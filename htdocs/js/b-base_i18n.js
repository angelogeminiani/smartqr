
(function(window, B, $, undefined) { 
    
    // ------------------------------------------------------------------------
    //                      i18n
    //                      
    //                      depends:
    //                          b.base.js
    //                      uses:
    //                          sf-base_cookies.js
    //                          sf-base_loaders.js
    // ------------------------------------------------------------------------
    //-- i18n namespace --//
    B.i18n = B.i18n||{};
    
    /**
     * Returns Cookie Language or browser language
     */
    B.i18n.getLang = function (){
        var auth = B.cookies.getAuth(),
        lang = auth?B.i18n.language(auth.lang):B.i18n.lang;
        return null!=lang?lang:B.i18n.lang;
    }
    
    B.i18n.getCountry = function (){
        var auth = B.cookies.getAuth(),
        country = auth?auth.country||"US":"US";
        return country;
    }
    
    B.i18n.getCurrency = function (){
        var auth = B.cookies.getAuth(),
        country = auth?auth.curr||"USD":"USD";
        return country;
    }
    
    B.i18n.getDecimalSep = function (){
        var auth = B.cookies.getAuth(),
        country = auth?auth.sep||".":".";
        return country;
    }
    
    /**
     * Initialize base dictionary loading resources under B.i18n namespace.
     * i.e B.i18n.close='Close'
     * In real world projects you will create your own dictionary
     * @param arr_packages Array of packages to load. i.e. ["./js/i18n/dictionary"]
     */
    B.i18n.init = function(arr_packages) {
        var language = B.i18n.getLang(),
        packages = {
            paths:arr_packages||["js/i18n/dictionary"],
            language:language
        };
        _load(packages); 
    };

    B.i18n.formatCurrency = function(num) {
        return B.formatCurrency(num, 2, B.i18n.getDecimalSep());
    }
    
    /* Ensure language code is in the format aa-AA. */
    B.i18n.normaliseLang = function (lang) {
        lang = lang.replace(/_/, '-').toLowerCase();
        if (lang.length > 3) {
            lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
        }
        return lang;
    }
    /** Extract language code from normalized lang (it from it-IT) **/
    B.i18n.language = function (lang) {
        lang = lang.replace(/_/, '-').toLowerCase();
        if (lang.length > 2) {
            lang = lang.split("-")[0];
        }
        return lang;
    }
    
    /* Retrieve the default language set for the browser. */
    B.i18n.lang = B.i18n.normaliseLang(navigator.language /* Mozilla */ ||
        navigator.userLanguage /* IE */);
    
    /**
     * Load localized resource (usually html or vhtml file).
     * @param {string} path: i.e. "/templates/mytemplate.html"
     * @param {object} opt_data: (Optional) optional data to replace into 
     * file template
     */
    B.i18n.load = function (path, opt_data) {
        var lang = B.i18n.getLang(),
        tokens = path.split("."),
        filename = tokens[0],
        ext = tokens.length>1?tokens[1]:"html",
        response, result;
 
        response = B.html.load(filename + "_" + lang + "." + ext);
        if(!response){
            response = B.html.load(filename + "." + ext);
        }
        result = response?response.responseText:"";
        
        
        return null!=opt_data ? B.format(result, opt_data) : result;
    }
    
    // ------------------------------------------------------------------------
    //                  p r i v a t e
    // ------------------------------------------------------------------------
 
    
    /**
     * Load and execute javascript language package.
     * @param settings Object settings:
     *                - paths (Array) Array of files to load  
     *                - language (string) (optional, default lang): 
     *                  laguage to load, if omitted default language
     *                  will be used.
     *                - timeout (int) (optional, default 500) 
     * @Example: _load({paths:["./js/i18n/dictionary"]}); 
     */
    function _load (settings) {
        // variables
        var i=0,
        paths = $.isArray(settings.paths) 
        ? settings.paths  : [settings.paths],
        lang = settings.language 
        ? B.i18n.normaliseLang(settings.language) : B.i18n.lang,
        timeout = settings.timeout != null ? settings.timeout : 500,
        /** internal function to load resources **/
        loadFile = function(fileName, lang) {
            var tokens = lang.split("-");
            if (tokens.length >= 1) {
                B.script.load(fileName + '_' + tokens[0] + '.js', {
                    async:false,
                    timeout: timeout,
                    statusCode: {
                        404: function() {
                            if(tokens.length >= 2){
                                B.script.load(fileName + '_' + tokens[0]
                                    .concat("-", tokens[1]) + '.js', {
                                        async:false,
                                        timeout: timeout,
                                        statusCode: {
                                            404: function() {
                                                // load base
                                                B.script.load(fileName + '.js', {
                                                    async:false,
                                                    timeout: timeout
                                                }); 
                                            }
                                        }
                                    }); 
                            } else {
                                // load base
                                B.script.load(fileName + '.js', {
                                    async:false,
                                    timeout: timeout
                                });
                            }
                        }
                    }
                });
            }
        };
        
        /** start loading js files with localizations **/
        for (i = 0; i < paths.length; i++) {
            loadFile(paths[i], lang);
        }
    }
    
    
    // ------------------------------------------------------------------------
    //                      CUSTOM i18n
    // i18n can be extended simply adding files that extend B.i18n namespace.
    // Declare a localization like this:
    // (function(B){
    //      
    //      if(!B.i18n) B.i18n={};
    //      var ns = B.i18n;
    //      
    //      ns.close = "Close";
    //      ns.open = "Open";
    // })(beeing);      
    // 
    // You can include i18 files in your markup simply using 
    // $req.getI18nfile('name') in a SCRIPT tag:
    // i.e. : 
    // <script type="text/javascript" src="$req.getI18nfile('mydictionary')"></script>   
    // produce output:
    // <script type="text/javascript" src="../js/mydictionary_en.js"></script>                            
    // ------------------------------------------------------------------------
    
    
    //-- autoinit i18n --//
    B.i18n.init();
    
})(window, beeing, jQuery); 
