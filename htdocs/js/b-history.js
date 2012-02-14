(function(window, B, $, undefined) {
    // check namespace history
    if(!B.history) B.history={};
    var ns = B.history,
    hcookies_name = "hcookies", hcookie_name="hcookie",
    hcookies = function(){
        try{
            var s = B.cookies.getOrCreate(hcookies_name, 0);
            return parseInt(s);
        }catch(err){
            return 0;
        }
        
    },
    getCurrentUrl = function (){
        var url = B.uri.current();
        return url.attr.fullpath;
    },
    store = function (count, url){
        // inc cookie counter
        if(B.isNumber(count)){
            B.cookies.set(hcookies_name, count+1, 0);
            // add new cookie url
            if(url){
                B.cookies.set(hcookie_name+"_"+count, url, 0);
            }
        }
    },
    remove = function (count, uriCookie){
        if(B.isNumber(count)){
            B.cookies.set(hcookies_name, count-1, 0);
            if(uriCookie){
                B.cookies.remove(uriCookie.name);
            }
        }
    },
    enter = function() {
        var url = getCurrentUrl(),
        uris = B.cookies.find({
            name:hcookie_name+"_", 
            value:url
        }),
        count = hcookies();
        // add only if does not exists   
        if(uris.length==0){
            store(count, url);
        }
    },
    exit = function(currentPath) {
        var url = currentPath?currentPath:getCurrentUrl(),
        uris = B.cookies.find({
            name:hcookie_name+"_", 
            value:url
        }),
        count = hcookies();
        // remove only if exists   
        if(uris.length>0){
            remove(count, uris[0]);
        }
    };

    ns.initialLength = (function(){
        return parseInt(hcookies());
    })();
    /**
     * Initializes history
     */
    ns.init = function () {
        // add current uri to history
        enter();
    // add listener to unload
    //$(window).unload(exit);
    }
    ns.length = function(){
        return parseInt(hcookies());
    };
    ns.canGoBack = function(){
        var uriCookies = B.cookies.find({
            name:hcookie_name+"_"
        }),
        uriCookie;
        if(uriCookies.length>0){
            uriCookie = B.getFromLast(uriCookies, 2);
            return uriCookie ? !(uriCookie.value==getCurrentUrl):false;
        }
        return false;
    };
    ns.back = function(){
        var count, uriCookies, uriCookie;
        count = parseInt(hcookies());
        if(count>0){
            uriCookies = B.cookies.find({
                name: hcookie_name+"_",
                sort: function(a,b){
                    var valA = parseInt(a.name.split("_")[1]), 
                    valB = parseInt(b.name.split("_")[1]);
                    return valA-valB;
                }
            });
            uriCookie = B.getFromLast(uriCookies, 2);
            if(uriCookie){
                exit();
                window.location = uriCookie.value;
                return;
            }
        } 
        // back using browser history
        if(window.history){
            window.history.back();
        }
    };
    
    
})(window, beeing, jQuery);