
(function(window, B, $, undefined) { 
    
    // ------------------------------------------------------------------------
    //                      LOAD
    //                      
    //                      dependencies:
    //                          sf-base.js
    //                      uses:
    //                          sf-base_uri.js
    // ------------------------------------------------------------------------
    
    
    // ------------------------------------------------------------------------
    //                      script
    // ------------------------------------------------------------------------
    //-- script namespace --//
    B.script = B.script||{};
    
    /**
     * Load and execute  a script synchronously.
     * @param filename (string) Name path of file to download
     * @param options
     */
    B.script.load = function(/* string */ filename, /* object */ options){
        var opts = {
            async: false, 
            dataType: 'script',
            timeout: 500,
            url: B.uri.navpath(filename),
            error: function(jqXHR, textStatus, errorThrown){
                B.error("Error loading: '" + filename + "'. " + errorThrown?errorThrown.message:"");
            }
        }
        return $.ajax(options?$.extend(opts, options):opts);
    };
    
    // ------------------------------------------------------------------------
    //                      html
    // ------------------------------------------------------------------------
    //-- html namespace --//
    B.html = B.html||{};
    
    /**
     * Load and execute  a HTML as plain text; 
     * included script tags are evaluated when inserted in the DOM.
     * @param {string} filename  Name path of file to download
     * @param {object} options Optional ajax options to override defaults. ex: {async: true}
     */
    B.html.load = function(filename, options){
        if(B.hasText(filename)){
            var opts = {
                async: false, 
                dataType: 'html',
                timeout: 500,
                url: B.uri.navpath(filename)
            }
            return $.ajax(options?$.extend(opts, options):opts);
        } 
        return null;
    };
    
    // ------------------------------------------------------------------------
    //                      html
    // ------------------------------------------------------------------------
    //-- html namespace --//
    B.css = B.css||{};
    
    /**
     * Load and execute a CSS as plain text;
     * @param filename (string) Name path of file to download
     * @param options (object) Optional ajax options to override defaults. ex: {async: true}
     */
    B.css.load = function(/* string */ filename, /* object */ options){
        var 
        opts = {
            async: false, 
            dataType: 'text',
            timeout: 500,
            url: B.uri.navpath(filename)
        }, response;
        
        response = $.ajax(options?$.extend(opts, options):opts);
        
        $('head').append('<style>'+response.responseText+'</style>');
        
        return response;
    };
    
    // ------------------------------------------------------------------------
    //                      component
    // ------------------------------------------------------------------------
    //-- component namespace --//
    B.component = B.component||{};
    
    /**
     * Load HTML component synchronous and returns plain text.
     * 
     * @param filename (string) file to load
     * @param replace (object) Optional object for text format. ex. {'id':id, 'title':title}
     **/
    B.component.load = function(filename, replace){
        var 
        response = B.html.load(filename),
        text = response?response.responseText:"";
        
        if(replace){
            return B.format(text, replace);
        }
        return text;
    }
    
    
    
})(window, beeing, jQuery); 
