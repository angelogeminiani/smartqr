
(function(window, B, $, undefined) { 
    
    // ------------------------------------------------------------------------
    //                      URI parser
    //                      
    //                      dependencies:
    //                          sf-base.js
    //                      uses:
    // ------------------------------------------------------------------------
    /** namespace **/
    B.uri = B.uri||{};
    
    /**
     * Parse an url and return an uri object.
     * @param url
     * @param strictMode
     * @return uri object:
     *              - attr
     *              - param
     *              - seg
     *              
     **/
    B.uri.parse = function(url, strictMode){
        
        var key = ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","fragment"], // keys available to query
        parser = {
            strict  : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
            loose   :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
        },
        querystring_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g, // supports both ampersand and semicolon-delimted query string key/value pairs
        fragment_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g; // supports both ampersand and semicolon-delimted fragment key/value pairs

        var str = decodeURI( url ),
        res   = parser[ strictMode || false ? "strict" : "loose" ].exec( str ),
        uri = {
            attr : {}, 
            param : {}, 
            seg : {}
        },
        i = 14;
		
        while ( i-- ) {
            uri.attr[ key[i] ] = res[i] || "";
        }
		
        // build query and fragment parameters	
        uri.param['query'] = {};
        uri.param['fragment'] = {};
		
        uri.attr['query'].replace( querystring_parser, function ( $0, $1, $2 ){
            if ($1) {
                uri.param['query'][$1] = $2;
            }
        });
		
        uri.attr['fragment'].replace( fragment_parser, function ( $0, $1, $2 ){
            if ($1) {
                uri.param['fragment'][$1] = $2;
            }
        });
				
        // split path and fragement into segments		
        uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');
        uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');
        
        // compile a 'base' domain attribute
        uri.attr['base'] = uri.attr.host 
        ? uri.attr.protocol+"://"+uri.attr.host + (uri.attr.port ? ":" + uri.attr.port : '')  
        : '';
        
        // compile a 'basepath' domain attribute
        uri.attr['basepath'] = uri.attr.base + uri.attr.path;
        
        // compile a 'fullpath' domain attribute
        uri.attr['fullpath'] = uri.attr.query 
        ? uri.attr.basepath+"?" + uri.attr.query
        : uri.attr.basepath;
        
        return uri;
    };
    
    B.uri.param = function (/*string*/name) {
        var url = B.uri.current();
        return url.param.query[name];
    }
    
    /**
     * Return current path as URI object
     **/
    B.uri.current = function(){
        return B.uri.parse(window.document.location.href, false);
    }
    /**
     *Return a relative URL for navigation from a starting point to a destination.<br>
     * i.e. relative("/folder1/page1.html", "home.html") returns "../home.html"<br>
     * If I want navigate from page1.html to home.html, I must consider that page1.html is 
     * child of "folder1" folder.
     *@param pathinfo Object or String:
     *                  - current (string) Optional. This is the starting point
     *                      address. if omitted, the current path is used.
     *                  - target (string) This is destination page.
     **/
    B.uri.navpath = function(/*object*/pathinfo){
        var current, target, levels;
        if(pathinfo){
            if(typeof(pathinfo)==="string"){
                current = B.uri.current().attr.path;
                target = pathinfo;
            } else {
                current = pathinfo.current
                ? B.uri.parse(pathinfo.current, false).attr.path
                : B.uri.current().attr.path;
                target = pathinfo.target||"";
            }
            if(!B.uri.isAbsolute(target)){
                levels = current.indexOf("/")===0
                ? current.split("/").length-2
                : current.split("/").length-1;
                if(levels>0){
                    return B.repeat("../", levels).concat(target.indexOf("/")===0?"/":"", target);
                }
            }
            return target;
        }
        return "";
    }
    
    B.uri.isAbsolute = function(path){
        return B.startsWith(path.toString().toLowerCase(), 'http')||B.startsWith(path.toString().toLowerCase(), '/');
    }
    
    B.uri.isUri = function(path){
        var text = path.toString().toLowerCase();
        return B.startsWith(text, "http") || B.startsWith(text, "/") || B.startsWith(text, "./") || B.startsWith(text, "../")
    }
    
    
    
})(window, beeing, jQuery); 
