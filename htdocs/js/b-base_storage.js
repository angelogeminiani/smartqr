
(function(window, B, $, undefined) { 
    
    // ------------------------------------------------------------------------
    //                      Storage
    //                      
    //                      dependencies:
    //                          b.base.js
    //                      uses:
    //                          
    // ------------------------------------------------------------------------
    
    B.storage = B.storage||{};
    
    B.storage.ready = (function(){
        try{
            return Modernizr ? Modernizr.localstorage:false;
        }catch(err){  
        }
        return false;
    })();

    B.storage.clear = function(){
        try{
            if(Modernizr){
                if(Modernizr.localstorage){
                    localStorage.clear();  
                }
            }  
        }catch(err){
            B.error(err);
        }
    };
    
    B.storage.set = function (/*string*/key, /*string*/value) {
        try{
            if(Modernizr){
                if(Modernizr.localstorage){
                    localStorage.setItem(key, value);  
                }
            }
        }catch(err){  
            B.error(err);
        }
    }
    
    B.storage.get = function(/*string*/key, /*string*/defval) {
        try{
            if(Modernizr){
                if(Modernizr.localstorage){
                    if(key in localStorage){
                        return localStorage.getItem(key);
                    } 
                }
            }
            return defval;
        }catch(err){  
            B.error(err);
        }
        return defval;
    }
    
    B.storage.remove = function (/*string*/key) {
        try{
            if(Modernizr){
                if(Modernizr.localstorage){
                    var result = localStorage.getItem(key); 
                    localStorage.removeItem(key);  
                    return result;
                }
            }
            return null;
        }catch(err){ 
            B.error(err);
        }
        return null;
    }
    
    B.storage.data = function(/*object*/data){
        try{
            if(B.storage.ready){
                if(data){
                    // SAVE
                    for(key in data){
                        localStorage.setItem(key, data[key]);
                    }
                } else {
                    // RETURN ALL
                    data = {};
                    for(key in localStorage){
                        data[key] = localStorage.getItem(key);
                    }
                }
            }
            return data;
        }catch(err){  
            B.error(err);
        }
        return data;
    }
    
        
    
    
})(window, beeing, jQuery); 
