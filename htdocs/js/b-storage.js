(function(window, B, $, undefined) {
    
    // check namespace
    B.storage=B.storage||{};
    var ns = B.storage;
    
    /**
     * Persistent archive.
     * Uses localStorage if supported, otherwise cookies.
     **/
    ns.Storage = function(/*string*/name, /*integer*/ days) {

        // --------------------------------------------------------------------
        //                      private
        // --------------------------------------------------------------------
        var self = this,
        _days = days||7,
        _storageMap = initStorage(self),
        _funcOnError,
        ON_UNSUPPORTED_ERROR = 'UNSUPPORTED_ERROR';
        
        function initStorage(instance) {
            var result = new B.HashMap(),
            json, expires;
            
            // add default values
            result.put(instance.FLD_EXPIRES, getExpireDate(_days));
            
            // with name retrieve cookie or local store content
            // deserialize into map.
            if(B.storage.ready){
                // use localstore
                json = B.storage.get(name);
            } else if (B.cookies.enabled) {
                // use cookie
                json = B.cookies.get(name);
            } else {
                if(_funcOnError){
                    _funcOnError($.Event(ON_UNSUPPORTED_ERROR));
                }
            }
            // Check if json has text and in the case deserialize it.
            if(B.hasText(json)){
                result.parse(json);
                // add expire date to localStore
                if(B.storage.ready){
                    expires = result.get(instance.FLD_EXPIRES)||null;
                    if(expires!=null){
                        if(expired(expires)){
                            result.clear();
                            result.put(instance.FLD_EXPIRES, getExpireDate(_days));
                        }
                    } else {
                        result.put(instance.FLD_EXPIRES, getExpireDate(_days));
                    } 
                }
            }
            
            return result;
        }
        
        function getExpireDate(days){
            var date = new Date(),
            realdays = days===-1?36500:days;
            date.setTime( date.getTime() + (realdays*24*60*60*1000) );
            return date.getTime();
        }
        
        function expired(time){
            var date = new Date();
            date.setTime(time);
            return date?(date < new Date()):false;
        }
        
        function saveStorage() {
            // serialize data into storage
            var data = _storageMap.toString();
            
            if(B.storage.ready){
                // use localstore
                B.storage.set(name, data);
            } else if (B.cookies.enabled) {
                // use cookie
                B.cookies.set(name, data, _days);
            }
        }
        
        function clearStorage() {
            // clear cookie or localStore
            if(B.storage.ready){
                // use localstore
                B.storage.remove(name);
            } else if (B.cookies.enabled) {
                // use cookie
                B.cookies.remove(name);
            }
        }
        
        

        // --------------------------------------------------------------------
        //                      PUBLIC
        // --------------------------------------------------------------------
        
        self.isEmpty = function() {
            if(_storageMap.isEmpty()){
                return true;
            } else if(_storageMap.size() ==1 && null != _storageMap.get(this.FLD_EXPIRES)){
                return true;
            }
            return  false;
        }
        
        self.clear = function() {
            _storageMap.clear();
            clearStorage();
        }
        
        self.getKeys = function() {
            return _storageMap.keys();
        }
        
        self.getValues = function() {
            return _storageMap.values();
        }
        
        self.get = function(/*string*/ key) {
            return _storageMap.get(key);
        }
		
        self.addOrUpdate = function(/*string*/key, /*object*/value) {
            _storageMap.put(key,value);
            saveStorage();
        }

        self.remove = function(/*string*/ key) {
            _storageMap.remove(key);
            saveStorage();
        }
        
        self.onError = function(func){
            _funcOnError = func;
        }
        
        
        
    }
    
    ns.Storage.prototype.FLD_EXPIRES = "STORAGE_EXPIRES";
    
    ns.Storage.prototype.isInternalField = function(fieldName){
        return this.FLD_EXPIRES===fieldName;
    };
    
// ------------------------------------------------------------------------
//                      EXIT
// ------------------------------------------------------------------------
    
})(window, beeing, jQuery);