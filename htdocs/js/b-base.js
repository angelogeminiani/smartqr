
var beeing = (function (window, version, $, undefined) { 
    
    // ------------------------------------------------------------------------
    //                      Base Components
    //                      
    //                      dependencies:
    //                          
    //                      uses:
    //                          
    // ------------------------------------------------------------------------
    
    // define base B object class
    var Bclass = function(){},  // constructor
    p = Bclass.prototype,
    B;

    // ------------------------------------------------------------------------
    //                      GLOBAL VAR
    // ------------------------------------------------------------------------
    
    p.accountid = '';
    p.userid = '';
    p.username = '';
    p.userenabled = false;
    p.isauth = false;
    p.lang = 'en';
    p.currency = 'USD';
    p.country = 'US';
    p.decimals = 2;
    p.decimalsep = '.';
    
    /**
     * When cookie lib is initialized, call also B.initGlobal();
     **/
    p.initGlobal = function(authcookie){
        if(authcookie && authcookie.userid && authcookie.username){
            p.userid =      authcookie.userid||p.userid;
            p.accountid =   authcookie.accountid||p.accountid||p.userid;
            p.username =    authcookie.username||p.username;
            p.lang =        authcookie.lang||p.lang;
            p.currency =    authcookie.curr||p.currency;
            p.country =     authcookie.country||p.country;
            //p.decimals =  authCookie.userid||p.decimals;
            p.decimalsep =  authcookie.sep||p.decimalsep;
            
            // set authorization
            p.isauth = (p.hasText(p.userid) && !p.isNULL(p.username)); 
            
            // user enabled
            p.userenabled = null!=authcookie.userenabled?authcookie.userenabled:false;
        }
    }

    // ------------------------------------------------------------------------
    //                      Version and Common Methods
    // ------------------------------------------------------------------------
    
    // return class version
    p.version = function (){
        return version
    };  // this is a closure
    
    p.toString = function () {
        return "Quickpin: version=" + version
    };
    
    /**
    * Create and return a "version 4" RFC-4122 UUID string.
    */
    p.UUID = function() {
        var s = [], itoh = '0123456789ABCDEF', i;
 
        // Make array of random hex digits. The UUID only has 32 digits in it, but we
        // allocate an extra items to make room for the '-'s we'll be inserting.
        for (i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);
 
        // Conform to RFC-4122, section 4.4
        s[14] = 4;  // Set 4 high bits of time_high field to version
        s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence
 
        // Convert to hex chars
        for (i = 0; i <36; i++) s[i] = itoh[s[i]];
 
        // Insert '-'s
        s[8] = s[13] = s[18] = s[23] = '-';
 
        return s.join('');
    }
 
    // ------------------------------------------------------------------------
    //                      Logging
    // ------------------------------------------------------------------------
    
    p.log = function() {
        try{
            if(console && typeof console.log==="function"){
                console.log.apply(console, arguments);
            }
        }catch(e){}
    };
    p.info = function() {
        try{
            if(console && typeof console.info==="function"){
                console.info.apply(console, arguments);
            }
        }catch(e){}
    };
    p.warn = function() {
        try{
            if(console && typeof console.warn==="function"){
                console.warn.apply(console, arguments);
            }
        }catch(e){}
    };
    p.error = function() {
        try{
            if(console && typeof console.error==="function"){
                console.error.apply(console, arguments);
            }
        }catch(e){}
    };
    // ------------------------------------------------------------------------
    //                      HashTable object
    // ------------------------------------------------------------------------
    
    /**
     * HashMap implementation.
     * Create new instance using "new B.HashMap()".
     * This implementation uses two internal arrays, one for keys and one for values.
     * 
     * @author Gian Angelo Geminiani
     */
    p.HashMap = function() {
        var self = this,
        _keys = new Array(),
        _values = new Array(),
        // return index of key
        _indexOf = function(key){
            for(var i=0; i<_keys.length; i++){
                if(B.equals(_keys[i],key)){
                    return i;
                }
            }
            return -1;
        };
        
        /**
         * Return map data serialized
         */
        self.toString = function(){
            return JSON.stringify({
                keys:_keys, 
                values:_values
            });
        };
        
        /**
         * Parse a string and deserialize 'keys' and 'values'.
         */
        self.parse = function (/*string*/s) {
            var obj = JSON.parse(s), 
            i, key, value;
            if(obj.keys&&obj.values&&obj.keys.length===obj.values.length){
                // add keys and values (null keys are not allowed)
                for(i=0;i<obj.keys.length;i++){
                    key = obj.keys[i];
                    value = obj.values[i];
                    if(null!=key&&null!=value){
                        self.put(key, value);
                    }
                }
            }
        }
        
        
        /**
         * Returns an array with all values.
         */
        self.values = function (){
            return _values.slice(0);  
        };
        
        /**
         * Returns an array with keys.
         */
        self.keys = function (){
            return _keys.slice(0);  
        };
        
        // return size of hashmap
        self.size = function (){
            return _keys.length;  
        };
        
        self.isEmpty = function (){
            return _keys.length===0;  
        };
        
        self.contains = function(/*any object*/key){
            return null!=self.get(key);
        };
        
        // put new item into hashmap
        self.put = function (/*any object*/key,/*any object*/value){
            var i = _indexOf(key);
            if(i===-1){
                _keys.push(key);
                _values.push(value);
            } else {
                // replace item
                _values[i]=value;
            }
            return value;
        };
        
        // return item from hashmap, or null if item was not found
        self.get = function (/*any object*/key) {
            var i = _indexOf(key);
            if(i>-1){
                return _values[i];
            }
            return null;
        };
        
        /**
         * Returns an object containig key-value pair.
         */
        self.getAt = function(/*integer*/index){
            if(B.isNumber(index)&&self.size()>index){
                return {
                    key:_keys[index],
                    value:_values[index]
                };
            }
            return null;
        };
        
        self.remove = function(/*any object*/key) {
            var i = _indexOf(key),
            result = null;
            if(i>-1){
                result = _values[i];
                _values[i]=null;
                _keys[i]=null;
                _keys.splice(i, 1);
                _values.splice(i, 1);
            }
            return result;
        };
        
        /**
         * Empty hash map
         */
        self.clear = function(){
            // invalidate references
            for(var i=0; i<_keys.length; i++){
                _keys[i]=null;
                _values[i]=null;
            }
            // create new arrays
            _keys = new Array();
            _values = new Array();
        };
    };
    
    // ------------------------------------------------------------------------
    //                      EventHandler
    // ------------------------------------------------------------------------
    
    p.EventManager = function(){
        var self = this,
        _counter=0;

        // --------------------------------------------------------------------
        //                      P U B L I C
        // --------------------------------------------------------------------
        
        self.contains = function(selector, event){
            return null!=self.get(selector, event);
        };
        
        self.get = function(/*string*/selector, /*string*/event){
            var map = self[event];
            if( null!=map ){
                return map.get(selector); // return function 
            }
            return null;
        };
        
        self.put = function(/*string*/selector, /*string*/event, /*function*/func){
            if(B.isFunction(func)){
                var map = self[event]||new B.HashMap();
                if( null!=map ){
                    self[event]=map;
                    map.put(selector, func); // store function 
                    _counter++;
                }  
            }
        };
        
        self.remove = function(/*string*/selector, /*string*/event){
            var map = self[event];
            if( null!=map ){
                map.remove(selector); // remove function 
                if(_counter>0){
                    _counter--;
                }
            }  
        };
        
        self.isEmpty = function (){
            return _counter===0;  
        };
        
        /**
         * Unbind all listeners
         **/
        self.clear = function() {
            for(var event in self){
                try{
                    if(B.isString(event)){
                        var map = self[event], selectors=map.keys();
                        for(var i=0;i<selectors.length;i++){
                            self.unbind(selectors[i], event);
                        }
                    }
                }catch(err){}
            }
        }
        
        /**
         * Bind an event to elements.
         *  @param selector {string}{array}
         *  @param event {string} The event to bind live. 
         *     You can use also Namespaces.
         *     namespaces are defined by using a period (.) character when 
         *     binding a handler:
         *       $('#foo').bind('click.myEvents', handler);
         *     When a handler is bound in this fashion, we can still unbind it the normal way:
         *       $('#foo').unbind('click');
         *     However, if we want to avoid affecting other handlers, we can be more specific:
         *       $('#foo').unbind('click.myEvents');
         *     We can also unbind all of the handlers in a namespace, regardless of event type:
         *       $('#foo').unbind('.myEvents');
         *     It is particularly useful to attach namespaces to event bindings 
         *     when we are developing plug-ins or otherwise writing 
         *     code that may interact with other event-handling code in the future.
         *  @param func The function that handle event
         **/
        self.bind = function(/*string*/selector, /*string*/event, /*function*/func){
            if(B.isFunction(func)){
                if(!self.contains(selector, event)){
                    self.put(selector, event, func);
                    $(selector).bind(event, func);
                }
            } else {
                B.error("'%s' is not a FUNCTION.", func);
            }
        };
        
        /**
         * Attach a handler to the event for all elements which match the 
         * current selector, now and in the future.
         *  @param selector {string}{array}
         *  @param event {string} The event to bind live. 
         *     You can use also Namespaces.
         *     namespaces are defined by using a period (.) character when 
         *     binding a handler:
         *       $('#foo').bind('click.myEvents', handler);
         *     When a handler is bound in this fashion, we can still unbind it 
         *     the normal way:
         *       $('#foo').unbind('click');
         *     However, if we want to avoid affecting other handlers, we can be 
         *     more specific:
         *       $('#foo').unbind('click.myEvents');
         *     We can also unbind all of the handlers in a namespace, regardless 
         *     of event type:
         *       $('#foo').unbind('.myEvents');
         *     It is particularly useful to attach namespaces to event bindings 
         *     when we are developing plug-ins or otherwise writing 
         *     code that may interact with other event-handling code in the future.
         *  @param func The function that handle event
         **/
        self.live = function(/*string*/selector, /*string*/event, /*function*/func){
            if(B.isFunction(func)){
                if(!self.contains(selector, event)){
                    self.put(selector, event, func);
                    $(selector).live(event, func);
                }
            } else {
                B.error("'%s' is not a FUNCTION.", func);
            }
        };
        
        /**
         * Remove a previously-attached event handler from the elements.
         * @param selector {string}{array}
         * @param event {string} The event to remove. 
         *     You can use also Namespaces.
         *     Namespaces are defined by using a period (.) character when 
         *     binding a handler:
         *       $('#foo').bind('click.myEvents', handler);
         *     When a handler is bound in this fashion, we can still unbind it the normal way:
         *       $('#foo').unbind('click');
         *     However, if we want to avoid affecting other handlers, we can be more specific:
         *       $('#foo').unbind('click.myEvents');
         *     We can also unbind all of the handlers in a namespace, regardless of event type:
         *       $('#foo').unbind('.myEvents');
         *     It is particularly useful to attach namespaces to event bindings 
         *     when we are developing plug-ins or otherwise writing 
         *     code that may interact with other event-handling code in the future.
         **/
        self.unbind = function(/*string*/selector, /*string*/event){
            $(selector).unbind(event);
            self.remove(selector, event);
        };
    
    };
    
    // ------------------------------------------------------------------------
    //                      Timers
    // ------------------------------------------------------------------------
    
    /**
     * Calls a function repeatedly, with a fixed time delay 
     * between each call to that function.
     * @param interval {Number}
     * @param func {Function}
     * @param context {Object}
     * @param argArray {Array}
     * @return timeOutID to use with clearInterval(timeOutID);
     */
    p.setInterval = function(interval, func, context, argArray){
        if(window){
            return window.setInterval(function() {
                if(typeof(func)==="function"){
                    func.apply(context||this, argArray);
                } else {
                    eval(func);
                    alert("called setInteval");
                }
            }, interval);
        }
        return 0;
    };
    
    /**
     * Executes a code snippet or a function after specified delay.
     * @param interval {Number}
     * @param func {Function}
     * @param context {Object}
     * @param argArray {Array}
     * @return timeOutID to use with clearInterval(timeOutID);
     */
    p.setTimeout = function(interval, func, context, argArray){
        if(window){
            return window.setTimeout(function() {
                if(typeof(func)==="function"){
                    func.apply(context||this, argArray);
                } else {
                    eval(func);
                    alert("called setTimeout");
                }
            }, interval);
        }
        return 0;
    };
    
    // ------------------------------------------------------------------------
    //                      Utils
    // ------------------------------------------------------------------------
    
    p.replaceAll=function(text, searchfor, replacetext){
        if(text){
            var regexp = new RegExp(searchfor, "g");
            return text.replace(regexp, replacetext);
        }
        return "";
    };
    
    // Return true if passed text starts with str substring
    p.startsWith = function (/* text to check */ text, /* start string */str) {
        return (text.indexOf(str) === 0);
    };
    p.endsWith = function (/* text to check */text, /* end string */str) {
        return (text.lastIndexOf(str||"") === text.length-(str?str.length:1));
    };
    p.unquote = function (/* text to quote */text) {
        if(text.length>1){
            if( (this.startsWith(text, "\"") && this.endsWith(text, "\"")) 
                || (this.startsWith(text, "'") && this.endsWith(text, "'")) ){
                return text.substring(1, text.length-1);
            }
        }
        return text;
    };
    p.hasText = function (text) {
        if(text){
            return text.toString().trim().length>0;
        }
        return false;
    };
    p.isNULL = function (object) {
        if(null!=object){
            if(p.isFunction(object)) {  
                return false;
            }else if(p.isArray(object)){
                return p.isEmpty(object);
            } else if (p.isString(object)) {
                return "NULL"===object.toString().toUpperCase() || !p.hasText(object) ;
            }
            return false;
        }
        return true;
    };
    p.isEmpty = function(array){
        if(p.isArray(array)){
            if(array.length>0){
                for(var i=0;i<array.length;i++){
                    if(!p.isNULL(array[i])){
                        return false;
                    }
                }
            }
            return true;
        }
        return p.isNULL(array);
    }
    p.isJSON = function(/*string*/text){
        return (typeof(text)==="string")&&text.indexOf("{")>-1;
    };
    p.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    p.isFunction = function (func) {
        return (typeof(func)==="function");
    };
    p.isArray = function (val) {
        return val
        ?(val instanceof Array)||(!B.isString(val) && null!=val.length)
        : false;
    };
    p.isString = function (s) {
        return (typeof(s)==="string");
    };
    p.isBoolean = function (b) {
        return (typeof(b)==="boolean");
    };
    p.isTrue = function (b) {
        return b&&b.toString()==="true";
    };
    p.isFalse = function (b) {
        return null!=b&&undefined!=b&&b.toString()==="false";
    };
    p.repeat = function (text, len) {
        return (new Array(len+1)).join(text);
    };
    /**
     * Left-pad a string with "filler" so that it's at least the given
     * number of characters long
     * @param text   The text to pad., ex.  "51"
     * @param filler The text to use as filler, ex. "0"
     * @param maxlen The desired length, ex. "10"
     * @return String with given number of characters, ex. "0000000051"
     */
    p.leftFill = function (text, filler, maxlen) {
        return p.repeat(filler, maxlen - String(text).length).concat(text);
    }
    /**
     * Format string replacing place holders.
     * ex. format("Hello {0}", "world") give output "Hello world".
     * ex. format("Hello {name}", {name:'jack'}) give output "Hello jack".
     * ex. format("Hello {B.encode:name}", {name:'http://'}) give output "Hello http%3A%2F%2F".
     * @params: var_args
     *      - {string} text to format. ex. "Hello {0}"
     *      - {string} variable number of arguments. ex. "world". Optionally
     *        first parameter after text can be an object, 
     *        ex. format("hello Mr.'{name}', you are a '{1}' '{adj}'", {name:"potato", adj:"vegetable}, "nice")
     *        returns "hello Mr. 'potato', you are a 'nice' 'vegetable'".
     **/
    p.format = function() {
        var args = arguments,
        text;
        if(args && args.length>0){
            text = args[0];
            if(null!=text){
                // replace numbers {0}, {1}
                text = text.replace(/{(\d+)}/g, function(match, number) {
                    var i = parseInt(number)+1,
                    val = args[i], result;
                    result = (typeof val!='undefined'&&null!=val&&typeof val!='object')
                    ? val
                    : match;
                    return result;
                });
                // replace strings {name1}, {name2}
                if(typeof(args[1])==="object"){
                    // get every . : or character [\.:\w]
                    text = text.replace(/{([\.:\w]+)}/g, function(match, number) {
                        var n = match.substring(1, match.length-1),
                        tokens = n.split(":"),
                        func = tokens.length>1?eval(tokens[0]):null,
                        name = tokens.length>1?tokens[1]:n,
                        value = typeof args[1][name] != 'undefined'
                        ? args[1][name]
                        : null,
                        result;
                        if(func){
                            value = func(value);
                        }
                        result = (typeof value != 'undefined'&&null!=value)
                        ? value
                        : match;
                        return result;
                    });  
                }
            } else {
                text = "";
            }
        } else {
            text = "";
        }
        return text; 
    };
    
    /**
     * Truncate long strings and append '...'
     * @param data (string or object) Text to truncate or options.
     *          If data is an object, this properties are expected:
     *              - selector: jQuery selector
     * @param max (integer) [Default=255] Max length of text including ellipsis characters
     * @param chars (string) [Default="..."] Ellipsis characters
     * 
     * @Example 
     *  B.ellipses("very long string", 6); returns "very..."
     *  Advanced usage: B.ellipses({selector:".trunc"}, 20);
     *                  This method loop on all ".trunc" selected elements and replace
     *                  text property. 
     **/
    p.ellipsis = function(data, max, chars){
        data=data||"";
        max=max||255;
        chars=chars||"...";
        if(typeof(data)==="string"){
            return data.length>max?data.substring(0, max-chars.length).concat(chars):data;
        } else if(typeof(data)==="object" && data.selector){
            $(window.document).ready(function(){
                $(data.selector).each(function(index, element){
                    var ctext = element.textContent,
                    text = B.ellipsis(ctext, max, chars);
                    $(element).text(text);
                });
            });
        }
        return data;
    };

    p.encode = function(/*string*/text){
        try{
            return encodeURIComponent(text||"");
        }catch(err){}
        return text||"";
    };
    /**
     * 
     * @param text (string)
     * @param options (object) 
     *              - defval: (string) default value if text is null or undefined
     *              - maxsize: (int) max length of text. If text exceed maxsize will be truncated
     *              - ellipses: (string) ellispses to append to text when truncated. Default is "..."
     **/
    p.decode = function(/*string*/text, /*object*/options){
        try{
            text = decodeURIComponent(text||"");
            if(options){
                if(text.length>0){
                    text = options.maxsize&&options.maxsize>0?p.ellipsis(text,options.maxsize, options.ellipses||"..."):text; 
                } else if (options.defval) {
                    text = options.defval; 
                }
            }
        } catch(err){}
        return text||"";
    }

    /**
     * Split a string into array. If "limit" is not assigned, this function 
     * works like String.split(). But if "limit" is assigned it creates
     * an array with legth equal limit parameter containig the entire string.
     * i.e. B.split("this is a string", " ", 2) returns
     * ["this", "is a string"].
     */
    p.split = function (text, separator, limit) {
        var array = text.split(separator),
        exceedarray, exceedtext="", i;
        if(limit && array.length>limit){
            exceedarray = array.splice(limit, array.length-limit);
            for(i=0;i<exceedarray.length;i++){
                if(exceedtext.length>0){
                    exceedtext +=separator;
                }
                exceedtext+=exceedarray[i];
            }
            array[array.length-1] = array[array.length-1].concat(separator, exceedtext);
        }
        return array;
    };
    /**
     * Return an Object (i.e. {param1:'val1', param2:'val2'}) parsing data
     * String.
     * @param data String to parse, i.e. "val1,val2,val3", "param1=val1&param2=val2"
     * @param sep Optional separator. If setted the parser split data into 
     * tokens, otherwise it test for JSON like string or 
     * following separators: "&", "|", ";", ","
     * @return Object, i.e. {param1:'val1', param2:'val2'}
     */
    p.toObject = function (/* string */data, /* optional separator*/ sep){
        var result, tokens, subtokens, i, item;
        if(typeof(data)==="string" && p.hasText(data)){
            result = {};
            if(sep){    // simply tokenize
                tokens = data.split(sep);
                for(i=0;i<tokens.length; i++){
                    item = tokens[i].trim();   
                    if(item.indexOf("=")>0){
                        subtokens = item.split("=");
                        if(subtokens.length==2){
                            result[subtokens[0].trim()]=subtokens[1].trim();
                        } else {
                            result["param".concat(i)]=item;
                        }
                    } else {
                        result["param".concat(i)]=item;
                    }
                }
            } else if(p.isJSON(data)){    // JSON
                result = JSON.parse(data);
            } else if(p.isNumber(data)){    // Number
                result = parseFloat(data);
            } else if(p.isNULL(data)){    // null
                result = null;
            } else if (data.indexOf("&")>0){
                result = p.toObject(data, "&");
            } else if (data.indexOf("|")>0){
                result = p.toObject(data, "|");
            } else if (data.indexOf(";")>0){
                result = p.toObject(data, ";");
            } else if ( p.startsWith(data, "[") && p.endsWith(data, "]") ){ // array
                result = eval(data);
            } else {
                result = p.toObject(data, ",");
            }
        } else {
            // already an object
            result = data;
        }
        return result;
    };
    /**
     * Return a query string like string from an array or 
     * an object (String or Object notation).
     * @param data Array of string, Object or String. i.e. ["val1", "val2"] or
     * {param1="val1", param2="val2"} or "{param1=val1,param2=val2}" 
     * @return Query string, i.e. param1=val1&param2=val2
     */
    p.toQueryString = function (/* object, array, string */data) {
        var result="", 
        i = 0;

        if(data instanceof Array){
            for(var item in data){
                i++;
                if(result.length>0){
                    result += "&";
                }
                result += "param".concat(i).concat("=").concat(item); 
            }
        } else if (data instanceof String) {
            p.toQueryString(p.toObject(data));
        } else if (typeof data == "object"){
            for(var m in data){
                i++;
                if(result.length>0){
                    result += "&";
                }
                result += m.concat("=").concat(data[m]); 
            }
        }
        return result;
    };
    
    p.toInt = function (s, def) {
        if(p.isNumber(s)){
            return parseInt(s);
        }
        return def?def:0;
    }
    
    p.toFloat = function (s, def) {
        if(p.isNumber(s)){
            return parseFloat(s);
        }
        return def?def:0.0;
    }
    p.toString = function (s, def) {
        if(s && s.toString().length>0){
            return s.toString();
        }
        return def?def:"";
    }
    p.image = function(/*string*/ s){
        if(s){
            return s;
        }
        return "/images/not_found.png";
    }
    
    /**
     * Compare 2 values. Values can be strings, objects or arrays.
     * @param val1
     * @param val2
     * @param opt_fieldname
     */
    p.equals = function(val1, val2, opt_fieldname){
        if(val1===val2){
            return true;
        }
        if(val1!=null&&val2!=null){
            // compare Arrays
            if(B.isArray(val1)&&p.isArray(val2)){
                if(val1.length===val2.length){
                    for(var i=0;i<val1.length;i++){
                        // get array values
                        var arrval1 = val1[i], arrval2 = val2[i];
                        if(arrval1!==arrval2){
                            // can check opt_fieldname?
                            if (opt_fieldname && (arrval1[opt_fieldname]&&arrval2[opt_fieldname])) { 
                                if( arrval1[opt_fieldname]!==arrval2[opt_fieldname] ){
                                    return false;
                                }
                            } else if(arrval1.id&&arrval2.id){
                                if( arrval1.id!==arrval2.id ){
                                    return false;
                                }
                            } else {
                                return false; 
                            }
                        }
                    }
                    return true;
                }
            }
            // compare objects by opt_fieldname
            if (opt_fieldname && (val1[opt_fieldname]&&val2[opt_fieldname])) { 
                if( val1[opt_fieldname]===val2[opt_fieldname] ){
                    return true;
                }
            }
        } // end if 
        
        // objects are different
        return false;
    };
    
    /**
     * Round a number to specific decimals.
     * @param num Number to round.
     * @param opt_decimals (Default=2) Number of decimals 
     */
    p.round = function(num, opt_decimals) {
        opt_decimals = opt_decimals||p.decimals;
        if(p.isNumber(num)){
            var factor = opt_decimals*10,
            val = Math.round(num*factor)/factor;
            return val;
        } 
        return num;
    };
    
    // ------------------------------------------------------------------------
    //                      Utils Currency
    // ------------------------------------------------------------------------
    
    /**
     * Format currency
     * @param num Number to format
     * @param opt_decimals (Optional. default=2) Number of decimals. 
     * @param opt_decsep (Optional. default=',') Decimal Separator. 
     */
    p.formatCurrency = function(num, opt_decimals, opt_decsep) {
        opt_decsep = opt_decsep||p.decimalsep;
        var amount = p.round(num||0.0, opt_decimals||p.decimals),
        delimThousand = opt_decsep==='.'?',':'.', // replace comma if desired
        delimDecimals = opt_decsep,
        arr = amount.toString().split('.',2),
        nDec = arr[1]||0,
        nInt = parseInt(arr[0]),
        minus = '', n='', a=[];
        if(isNaN(nInt)) {
            return num;
        }
        if(nInt < 0) {
            minus = '-';
        }
        nInt = Math.abs(nInt);
        n = new String(nInt);
        while(n.length > 3) {
            var nn = n.substr(n.length-3);
            a.unshift(nn);
            n = n.substr(0,n.length-3);
        }
        if(n.length > 0) {
            a.unshift(n);
        }
        n = a.join(delimThousand);
        if(nDec.length < 1) {
            amount = n;
        } else {
            amount = n + delimDecimals + nDec;
        }
        amount = minus + amount;
        return amount;
    };
    
    // ------------------------------------------------------------------------
    //                      Utils Date
    // ------------------------------------------------------------------------
    /**
     * Params:
     *  - {date} date: Date to format
     *  - {string} pattern: (Optional - Default is 'yyyymmdd') pattern. i.e. 'yyyymmdd', 'iso', 'isoDate', 'fullDate', etc..
     *  - {boolen} utc: True if you want an UTC date format
     * Usage: 
     *  i.e. B.dateFormat(new Date(), "yyyymmdd")
     *  You can use also Date object with "format" method.
     *  var isoDate = (new Date()).format('iso');
     **/
    p.dateFormat = function () {
        var	
        token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = p.dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var	_ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    // Some common format strings
    p.dateFormat.masks = {
        "default":      "yyyymmdd",
        dateTime:       "ddd mmm dd yyyy HH:MM:ss",
        shortDate:      "m/d/yy",
        mediumDate:     "mmm d, yyyy",
        longDate:       "mmmm d, yyyy",
        fullDate:       "dddd, mmmm d, yyyy",
        shortTime:      "h:MM TT",
        mediumTime:     "h:MM:ss TT",
        longTime:       "h:MM:ss TT Z",
        isoDate:        "yyyy-mm-dd",
        isoTime:        "HH:MM:ss",
        isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    p.dateFormat.i18n = {
        dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };

    // ------------------------------------------------------------------------
    //                      Utils Collection
    // ------------------------------------------------------------------------
    
    /**
     * Return -1 if nothing found.
     * Otherwise, are returned an index (numeric) or property name (string) of searched value.
     * "indexOf" behaviour depends on "item" parameter type:
     * if item is a string, indexOf acts as a simple String.indexOf(string) 
     * and expects that "criteria" parameter is a string too.
     * @param item Array, Object or String.
     * @param criteria Object or String, 
     * i.e. {check:-custom check function-, field:field1, value:value1}.
     * Criteria Properties:
     * - check: (Types: Function, omitted) Optional custom function (i.e. function(value, criteriavalue){/..code../})
     * - field: (Types: String, omitted) Name of field of object. You can omitt this property only if you pass a check custom function.
     * - value: (Types: String, Object, RegExp)Criteria check value. This value is comparated to item value.
     */
    p.indexOf = function(/* array, string, object */ item, /*String, Object, RegExp*/ criteria) {
        var i, itemvalue, value;
        if(typeof(item)==="string"){
            // STRING search
            return item.indexOf (criteria); 
        } else if (item instanceof Array){
            // ARRAY search
            for(i=0;i<item.length;i++){
                itemvalue = item[i];
                if(typeof(itemvalue)==="string"&&typeof(criteria)==="string"){
                    // strings should be equal
                    if(itemvalue===criteria){
                        return i;
                    }
                } else {
                    // recursive: check if array content match with criteria
                    value = B.toInt(p.indexOf(itemvalue, criteria), 0);
                    if(value>-1){
                        return i;
                    }
                }
            }
        } else if ( item && item instanceof Object ) {
            // OBJECT search
            for(i in item){
                itemvalue = item[i];
                // evaluate criteria
                if(typeof(criteria)==="string"){
                    // String match
                    if(criteria==itemvalue){
                        return i;
                    }
                } else if (criteria instanceof RegExp){
                    // RegExp match
                    if(itemvalue.toString().match(criteria)){
                        return i;
                    }
                } else{
                    // Object match
                    // assign value accordingly to criteria.field
                    value = criteria.field ? item[criteria.field] : itemvalue;
                    if($.isFunction(criteria.check)){
                        // - Custom Function matching
                        if(criteria.check(value, criteria.value)){
                            return i;
                        }
                    } else {
                        // - Field-Value matching
                        if(criteria.value instanceof RegExp){
                            // -- Matching with RegExp in criteria.value
                            if(value.toString().match(criteria.value)){
                                return i;
                            }
                        } else if (typeof(criteria.value)==="string"){
                            // -- Matching with String in criteria.value
                            if(value.toString().indexOf(criteria.value)>-1){
                                return i;
                            }
                        } else {
                            // -- Matching with Object in criteria.value
                            if(value==criteria.value){
                                return i;
                            }
                        }
                    }
                }
            }
        }
        return -1;
    };
    
    p.getAtIndex = function (/* Array */array, /* Integer */index){
        if(array instanceof Array && p.isNumber(index) && index>-1){
            if(array.length>index){
                return array[index];
            }
            return array[array.length-1];
        }
        return null;
    };
    
    p.getFromLast = function (/* Array */array, /* Integer */count){
        if(array instanceof Array && p.isNumber(count)){
            return count>0
            ? p.getAtIndex(array, array.length-count)
            : array[array.length];
        }
        return null;
    };
    
    p.removeAtIndex = function (/* Array */array, /* Integer */index){
        var result = null;
        if(array instanceof Array && p.isNumber(index) && index>-1){
            if(array.length>index){
                result = array[index];
                array.splice(index, 1);
            } else {
                result = array[array.length-1];
                array.splice(array.length-1, 1);
            }
        }
        return result;
    };
    
    /**
     * Return new array containg all elements matching in each array.
     * i.e. B.match(["a", "b"], ["c", "a"]) returns ["a"]
     * @param array1 {*array*}
     * @param array2 {*array*}
     * @param opt_fieldname {*string*} (Optional) Name of field to compare for 
     *          matching. If omitted, the two array's items are compared by 
     *          value.
     */
    p.match = function (/* Array */array1, /* Array */array2, opt_fieldname) {
        var result = new Array(),
        i;
        try{
            for(i=0;i<array1.length;i++){
                try{
                    if(opt_fieldname){
                        if(B.indexOf(array2, 
                        {
                            field: opt_fieldname, 
                            value:array1[i][opt_fieldname]
                        })){
                            // add value to response
                            result.push(array1[i]);
                        }
                    } else {
                        if(array2.indexOf(array1[i])>-1){
                            result.push(array1[i]);
                        }
                    }
                }catch(err){}
            }
        }catch(err){
            B.error(err);
        }
        return result;
    }
    
    /**
     * Merge arrays in unique array.
     **/
    p.merge = function (){
        var result = new Array(),
        i, ii, array;
        try{
            for(i=0;i<arguments.length;i++){
                array = arguments[i];
                if(B.isArray(array)){
                    for(ii=0;i<array.length;i++){
                        result.push(array[ii]);
                    }
                }
            }
        }catch(err){
            B.error(err);
        }
        return result;
    }
    // ------------------------------------------------------------------------
    //                      Utils Objects
    // ------------------------------------------------------------------------
    
    /**
     * Works like jQuery.extend method but support one more argument, the 
     * "excludes" array of properties that should not be copied.
     * "excludes" must be the first parameter, before all other parameters.
     * @Example: 
     *  var newobject = B.extend(["prop1"], {}, {prop1:"val1", prop2:"val2"});
     *  returns:
     *  {prop2:"val2"}
     *  
     **/
    p.extend = function(){
        var result, excludes = null;
        if(arguments && ((arguments[0] instanceof Array)||typeof(arguments[0])==="string")){
            excludes = arguments[0];
            delete arguments[0]; // remove 
        }
        // extend
        result = $.extend.apply(this, arguments);
        // try remove excludes
        if(excludes instanceof Array){
            for(var i=0;i<excludes.length;i++){
                delete result[excludes[i]];
            }
        } else if(typeof(excludes)==="string"){
            delete result[excludes];
        }
        
        return result;
    }
    

    // ------------------------------------------------------------------------
    //                      Browser
    // ------------------------------------------------------------------------
    
    p.browser = $ ? $.browser: {}; /* see at jQuery.browser object http://api.jquery.com/jQuery.browser/ */

    // ------------------------------------------------------------------------
    //                      Utils DOM (jQuery)
    // ------------------------------------------------------------------------
    
    /**
     * Return "value" attribute of hidden field by id.
     * Hidden fields are usefull to store server side variables generated by 
     * VTL language. Storing server side data in HTML hidden fields, expose this
     * data to javascript.
     * @param {string} fieldId ID of hidden field
     * @param {string} opt_parentId Optional ID of parent
     * @return "value" attribute of hidden field.
     * @Example <input type="hidden" id="_path_comp" value="$path_comp"/> 
     * can be retrieved simply calling: 
     * B.hidden("_path_comp");
     */
    p.hidden = function (fieldId, opt_parentId) {
        var result = "";
        try{
            if(opt_parentId){
                result = $("#"+fieldId, "#"+opt_parentId).attr("value");
            } else {
                result = $("#"+fieldId).attr("value");
            }
        } catch(err){
            p.error(err);
        }
        return result;
    }
    
    /**
     * Return true if hidden field contains a solved Velocity Variable.
     * If Velocity did not solve a variable, value starts with $ or #.
     **/
    p.hiddenIsSolved = function(/*string*/ value){
        if(typeof(value)==="string"){
            return !(value.indexOf("$")===0 || value.indexOf("#")===0);
        }
        return false;
    }
    
    /**
     * Parse jason content of hidden field and returns an object.
     * @param {string} fieldId
     * @param {string} opt_parentId
     **/
    p.hiddenObject = function (fieldId, opt_parentId){
        try{
            var text = p.hidden(fieldId, opt_parentId);
            return JSON.parse(p.decode(text));
        } catch(err){
            B.error(err);
        }
        return {};
    }
    
    // ------------------------------------------------------------------------
    //                      Inheritance
    // ------------------------------------------------------------------------
    
    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * Usage:
     * <pre>
     * function ParentClass(a, b) { }
     * ParentClass.prototype.foo = function(a) { }
     *
     * function ChildClass(a, b, c) {
     *   ParentClass.call(this, a, b);
     * }
     *
     * goog.inherits(ChildClass, ParentClass);
     *
     * var child = new ChildClass('a', 'b', 'see');
     * child.foo(); // works
     * </pre>
     *
     * In addition, a superclass' implementation of a method can be invoked
     * as follows:
     *
     * <pre>
     * ChildClass.prototype.foo = function(a) {
     *   ChildClass.superClass_.foo.call(this, a);
     *   // other code
     * };
     * </pre>
     *
     * @param {Function} childCtor Child class.
     * @param {Function} parentCtor Parent class.
     */
    p.inherits = function(childCtor, parentCtor) {
        /** @constructor */
        function tempCtor() {};
        tempCtor.prototype = parentCtor.prototype;
        childCtor.superClass_ = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.constructor = childCtor;
    };

    /**
     * Call up to the superclass.
     *
     * If this is called from a constructor, then this calls the superclass
     * contructor with arguments 1-N.
     *
     * If this is called from a prototype method, then you must pass
     * the name of the method as the second argument to this function. If
     * you do not, you will get a runtime error. This calls the superclass'
     * method with arguments 2-N.
     *
     * This function only works if you use B.inherits to express
     * inheritance relationships between your classes.
     *
     * This function is a compiler primitive. At compile-time, the
     * compiler will do macro expansion to remove a lot of
     * the extra overhead that this function introduces. The compiler
     * will also enforce a lot of the assumptions that this function
     * makes, and treat it as a compiler error if you break them.
     *
     * @param {!Object} me Should always be "this".
     * @param {*=} opt_methodName The method name if calling a super method.
     * @param {...*} var_args The rest of the arguments.
     * @return {*} The return value of the superclass method.
     */
    p.base = function(me, opt_methodName, var_args) {
        var caller = arguments.callee.caller;
        if (caller.superClass_) {
            // This is a constructor. Call the superclass constructor.
            return caller.superClass_.constructor.apply(
                me, Array.prototype.slice.call(arguments, 1));
        }

        var args = Array.prototype.slice.call(arguments, 2);
        var foundCaller = false;
        for (var ctor = me.constructor;
            ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
            if (ctor.prototype[opt_methodName] === caller) {
                foundCaller = true;
            } else if (foundCaller) {
                return ctor.prototype[opt_methodName].apply(me, args);
            }
        }

        // If we did not find the caller in the prototype chain,
        // then one of two things happened:
        // 1) The caller is an instance method.
        // 2) This method was not called by the right caller.
        if (me[opt_methodName] === caller) {
            return me.constructor.prototype[opt_methodName].apply(me, args);
        } else {
            throw Error(
                'B.base('+ opt_methodName + ') called from a method of one name ' +
                'to a method of a different name');
        }
    };

    /**
     * Return a standalone function that invokes the function f as a method of
     * the object o. This is useful when you need pass a method to a function
     * If you don't bind it to its object, the association will be lost and the
     * method you passed will be invoked as a regular function
     **/
    p.bindMethod = function (/* object */ o, /* function */ func){
        return function () {
            // invoke passed function into o context
            return func.apply(o, arguments);
        }
    };
    /**
     * Borrow methods from one class to use by another.
     */ 
    p.borrowMethods = function (/* from ctr func */from, /* to ctr func */to){
        var pfrom = from.prototype,
        pto = to.prototype;
        for(m in pfrom){
            if(typeof pfrom[m] != "function") continue;
            pto[m] = pfrom[m];
        }
    };
    
    
    // ------------------------------------------------------------------------
    //                      E N D
    // ------------------------------------------------------------------------
    
    //-- returns new instance of singleton --//
    B = new Bclass();
    window.B = window.beeing = B;
    return B;
    
})(window, "0.1.1", jQuery); 
