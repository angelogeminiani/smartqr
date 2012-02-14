
(function(window, B, $, undefined) { 
    
    // ------------------------------------------------------------------------
    //                      NAV
    //                      
    //                      depends:
    //                          b.base.js
    //                      uses:
    //                          sf-base_uri.js
    // ------------------------------------------------------------------------
    /** nav namespace **/
    B.nav = B.nav||{};
    
    /**
     * Navigate to destination.
     * @destination (string)
     * @query (string or object)
     */
    B.nav.go = function (/*string*/destination, /*string, object*/query){
        if(query&&typeof(query)==="object"){
            query = B.toQueryString(query);
        }
        var path = B.uri.navpath(destination).concat(query?"?"+query:""); 
        
        window.location.href = path;
    };
    
    B.nav.reload = function (/*string, object*/query){
        B.nav.go(B.uri.current().attr.path, query);
    };
    
    
    
})(window, beeing, jQuery); 
