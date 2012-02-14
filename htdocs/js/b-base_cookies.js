
(function(window, B, $, undefined) { 
    

    // ------------------------------------------------------------------------
    //                      Cookies Functions
    //                      
    //                      dependencies:
    //                          sf-base.js
    //                      uses:
    //                          
    // ------------------------------------------------------------------------
    
    B.cookies = B.cookies||{};
    
    var AUTH_NAME = "auth",
    AUTH_COOKIE = {
        accountid:'',
        userid:'', 
        username:'',
        ver:'0.4', 
        lang:B.lang,
        country:'EN',
        curr: 'USD',
        sep: '.',
        userenabled:false
    };
    /**
     * If true, the browser support cookies.
     * This property is auto-assigned during script parsing (autoinvoking function)
     */
    B.cookies.enabled = (function () {
        try{
            return window.navigator ? window.navigator.cookieEnabled : false; 
        }catch(err){
            return false;
        }
    })();

    /**
     * Returns an array of name-value pairs objects 
     * (i.e. {name:"auth", value:"valueauth"})
     * @param filter Object containig a filter. i.e. {name:"auth", value:"val1", sort:sortfunction/boolean}
     * The filter is optional and filter properties are optionals too.
     */
    B.cookies.find = function ( /* object */filter) {
        try{
            var result = new Array(), 
            ca = document.cookie.split(';'), 
            c, tokens, item;
        
            for(var i=0;i < ca.length;i++) {
                c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                tokens = B.split(c, "=", 2);
                if (tokens.length===2) {
                    item = {
                        name: tokens[0].trim(), 
                        value: B.unquote(tokens[1]).trim()
                    };
                    if(filter){
                        try{
                            if((filter.name?item.name.indexOf(filter.name)===0:true) 
                                && (filter.value ? item.value.indexOf(filter.value)===0:true)){
                                result.push(item);
                            }
                        }catch(err){}
                    } else {
                        result.push(item);
                    }
                }
            }
            // sort array
            if(filter && filter.sort){
                if($.isFunction(filter.sort)){
                    // custom sort
                    result.sort(filter.sort);
                } else {
                    // sort by name
                    result.sort(function(a,b){
                        var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
                        if (nameA < nameB){ //sort string ascending
                            return -1;
                        }
                        if (nameA > nameB){
                            return 1;
                        }
                        return 0; //default return value (no sorting)
                    });
                }
            }
        
            return result;
        }catch(err){
            return new Array();
        }
    }
    
    B.cookies.get = function (name) {
        try{
            var result = "",
            nameEQ = name + "=",
            ca = document.cookie.split(';'), 
            c = null;
            //var nameEQ = name + "=";
            //var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) {
                    result = c.substring(nameEQ.length,c.length);
                    return B.unquote(result.trim());
                }
            }
            return result;
        }catch(err){
            return "";
        }
    };
    
    B.cookies.getAuth = function () {
        try{
            var s = B.cookies.get(AUTH_NAME);
            if (B.hasText(s)){
                return JSON.parse( s );
            } else {
                return AUTH_COOKIE;
            }
        }catch(err){
            return AUTH_COOKIE;
        }
    };

    B.cookies.set = function (name, value, days) {
        try{
            var expires = "", date = null;
            if (days) {
                date = new Date();
                date.setTime( date.getTime() + (days*24*60*60*1000) );
                expires = "; expires="+date.toGMTString();
            }
            document.cookie = (name+"="+value+expires+"; path=/").trim();
        }catch(err){
        // unsupported
        }
    };
    
    B.cookies.setAuth = function (auth) {
        B.cookies.set("auth", JSON.stringify(auth), 15);
        
        // initialize GLOBAL variables in B
        B.initGlobal(auth);
    };
    
    B.cookies.remove = function (name) {
        B.cookies.set(name,"",-1);
    };
    
    B.cookies.removeAuth = function () {
        B.cookies.remove("auth");
        B.cookies.setAuth(AUTH_COOKIE);
    };
    
    B.cookies.getOrCreate = function (name, value, days) {
        var result = B.cookies.get(name);
        if(result){
            return result;
        }
        B.cookies.set(name, value, days?days:0);
        return B.cookies.get(name);
    };
    
    B.cookies.setJSON = function (name, object, opt_days){
        try{
            if(B.isString(object)){
                B.cookies.set(name, object, opt_days||0);  
            } else {
                B.cookies.set(name, JSON.stringify(object), opt_days||0);  
            }
        }catch(err){}
    }
    
    B.cookies.getJSON = function (name){
        try{
            var s = B.cookies.get(name);
            if(B.hasText(s)){
                return JSON.parse(s);
            }
            return {};
        }catch(err){
            return {
                error:err
            };
        }
    }
    
    // ------------------------------------------------------------------------
    //
    //          Account and Profile Cookie helpers
    //
    // ------------------------------------------------------------------------
    
    B.cookies.setAccountCookie = function(user){
        if(user){
            // set cookie
            var auth = B.cookies.getAuth();
        
            auth.accountid = user._id;
            auth.lang = user.lang;
            auth.userenabled = null!=user.enabled?user.enabled:false;
            auth.userid = user._id;
            auth.username = user.username;
            auth.country = user.country._id||"IT";
            auth.curr = user.country.currencycode||"EUR";
            auth.sep = user.country.decimalsep||",";

            B.cookies.setAuth(auth);
            B.Events.triggerLogin();
        } else {
            B.cookies.removeAuth();
        }
    }
    
    B.cookies.setProfileCookie = function(user){
        if(user){
            // set cookie
            var auth = B.cookies.getAuth();
        
            // auth.accountid = user._id;
            // auth.lang = user.lang;
            // auth.userenabled = null!=user.enabled?user.enabled:false;
            auth.userid = user._id;
            auth.username = user.username;
            auth.country = user.country._id||"IT";
            auth.curr = user.country.currencycode||"EUR";
            auth.sep = user.country.decimalsep||",";
        
            B.cookies.setAuth(auth);
            B.Events.triggerLogin();
        }
    }
    
    // ------------------------------------------------------------------------
    //
    //          Initialize B GLOBAL constants
    //
    // ------------------------------------------------------------------------

    B.initGlobal(B.cookies.getAuth());
    
    
})(window, beeing, jQuery); 
