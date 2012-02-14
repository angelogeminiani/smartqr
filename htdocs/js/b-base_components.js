
(function(window, B, $, undefined) { 
    
    // ------------------------------------------------------------------------
    //                      Base Components
    //                      
    //                      dependencies:
    //                          b.base.js
    //                      uses:
    //                          
    // ------------------------------------------------------------------------
    
    B.components = B.components||{};
    
    // ------------------------------------------------------------------------
    //                      Base 
    // ------------------------------------------------------------------------
    (function(){
        /**
         * Base is basic class for a no-graphic object.
         * 
         * @constructor
         */
        B.components.Base = function(/*object*/opt_model){
            // Unique Identifier
            this._uid = B.UUID();
            
            // extended model
            this._model = opt_model||{};
        
            this._model._listeners = new B.HashMap();
        };
        //-- fields --//
        B.components.Base.prototype._model=null;
        //-- methods --//
        B.components.Base.prototype.getId = function(){
            return this._uid;
        }
        B.components.Base.prototype.getModel = function(){
            return this._model;
        }
        B.components.Base.prototype.setModel = function(model){
            this._model = model;
        }
        B.components.Base.prototype.bind = function(eventName, callback){
            var 
            funcs = this._model._listeners.get(eventName)||new Array();
            // add function to array
            funcs.push(callback);
            // put event listener array into listeners map
            this._model._listeners.put(eventName, funcs);
        }
        B.components.Base.prototype.unbind = function(eventName, opt_callback){
            var 
            listeners = this._model._listeners,
            funcs = listeners.get(eventName)||null;
            if(funcs){
                if(opt_callback){
                    var index = funcs.indexOf(opt_callback);
                    if(index>-1){
                        funcs.splice(index, 1);
                    }
                } else {
                    listeners.remove(eventName);
                }
            }
        }
        B.components.Base.prototype.trigger = function(eventName, opt_data){
            var 
            listeners = this._model._listeners,
            e, funcs;
            if(!listeners.isEmpty()){
                funcs = listeners.get(eventName);
                if(funcs && funcs.length>0){
                    e = $.Event(eventName);
                    e.model = B.extend({}, this._model, opt_data||{});
                    e.sender = this;
                    // trigger event
                    for(var i in funcs){
                        if(B.isFunction(funcs[i])){
                            funcs[i].call(this, e);
                        }
                    }
                }
            }
        }
    })();
    
    // ------------------------------------------------------------------------
    //                      BaseComponent
    // ------------------------------------------------------------------------
    // 
    // Component closure for private STATIC  methods and constants
    (function(){
        
        /**
         * Base Component to inherit from.
         * @constructor
         * 
         * @param data
         *          - model
         *          - view:
         *          - opt_class {string}: (Optional) style class of component. Default = [name of view file]
         *          - opt_tag {string}: (Optional) tag name of component. Default = 'div'
         *          - opt_prepend {boolean}: (Optional) if true component is prepended to its parent
         **/
        B.components.BaseComponent = function(data){
            // Unique Identifier
            this._uid = B.UUID();
            // view
            this._view = data&&(data.view||"");
            // componentClass
            this._componentClass = data?data.opt_class||_getName(this._view):_getName(this._view);
            this._tag = data&&(data.opt_tag||'div');
            this._prepend = data&&(data.opt_prepend||false);
            // extended model
            this._model = B.extend(
            {
                uuid:this._uid
            }, 
            data&&(data.model||{}));
            // event handlers manager
            this._eh = new B.EventManager(); 
        }
        /**
        * Unique id for component.
        * @type {string}
        * @private
        */
        B.components.BaseComponent.prototype._view="";
        B.components.BaseComponent.prototype._componentClass="basecomponent";
        B.components.BaseComponent.prototype._model=null;
        B.components.BaseComponent.prototype._tag="div";
        B.components.BaseComponent.prototype._prepend=false;
        B.components.BaseComponent.prototype._parentId=null;
        B.components.BaseComponent.prototype._parent=null;
        B.components.BaseComponent.prototype._eh=null;
        B.components.BaseComponent.prototype._listenedEvents=null;
        
        B.components.BaseComponent.prototype.getId = function(){
            return this._uid;
        }
        B.components.BaseComponent.prototype.getModel = function(){
            return this._model;
        }
        B.components.BaseComponent.prototype.setModel = function(model){
            this._model = B.extend(this._model||{}, model);
        }
        /**
         * Returns component css class name. i.e. "MyComponent".
         */
        B.components.BaseComponent.prototype.getComponentClass = function(){
            return this._componentClass;
        }
        /**
         * Returns component css selector by id. i.e. "#[component-id]" 
         */
        B.components.BaseComponent.prototype.getSelector = function(){
            return "#" + this.getId();
        }
        /**
         * Return jQuery selector for children components.
         * This is shortcut for $(selector, this.getSelector()).
         * @param {string} selector: Children selector. i.e. "#compid", ".classname", etc..
         */
        B.components.BaseComponent.prototype.getChildren = function(selector){
            return $(selector, this.getSelector());
        }
        /**
         * Remove all items from model
         **/
        B.components.BaseComponent.prototype.clearModel = function(){
            this._model = {};
        }
        B.components.BaseComponent.prototype.getParentId = function(){
            return this._parentId;
        }
        B.components.BaseComponent.prototype.getParent = function(){
            return this._parent;
        }
        /**
         * Attach current component to parent.
         * @param parentId {string}
         * @param opt_tagName {string} (Optional) Name of tag for component. 
         *                      Default value is 'div'.
         **/
        B.components.BaseComponent.prototype.setParent = function(parentId, opt_tagName){
            // set parent reference
            _initParent(this, parentId);
    	
            // load HTML view for current component
            var html = B.component.load(this._view, this.getModel()),
            container = B.format("<{tag} id='{uid}' class='component {compClass}'></{tag}>", 
            {
                uid:this._uid, 
                compClass:this._componentClass, 
                tag:opt_tagName||this._tag
            });
            
            if(this._prepend){
                $("#"+this._parentId).prepend(container);
            } else {
                $("#"+this._parentId).append(container);
            }

		
            // ready to attach component HTML to parent container
            if(B.hasText(html)){
                // attach component
                $("#"+this._uid, "#"+this._parentId).append(html);
            }
        }
        
        B.components.BaseComponent.prototype.hide = function(){
            if(this._parentId){
                $(this.getSelector(), this.getParent()).hide();
            }
        }
        
        B.components.BaseComponent.prototype.show = function(){
            if(this._parentId){
                $(this.getSelector(), this.getParent()).show();
            }
        }
        
        /** Remove component **/
        B.components.BaseComponent.prototype.detach = function(){
            if(this._parentId){
                $("#"+this._uid, "#"+this._parentId).remove();
            }
            // remove listenedEvents
            this._eh.clear();
        }
        /** Append event listener to destination. **/
        B.components.BaseComponent.prototype.listen = function(selector, eventName, callback, live){
            try{
                var 
                self = this,
                component = selector||"#"+this._uid,
                call = function(e){
                    if(B.isFunction(callback)){
                        if(e){
                            e.model = e.model||self.getModel();
                            e.sender = e.currentSender||self;
                            e.currentSender = self;
                        } else {
                            e=$.Event(eventName);
                            e.event = null;
                            e.model = self.getModel();
                            e.currentSender = self;
                            e.sender = self;
                        }
                        callback.call(self, e);
                    }
                };
                if(live){
                    self._eh.live(component, eventName, call);
                } else {
                    self._eh.bind(component, eventName, call);
                }
            }catch(err){
                B.error(err);
            }
        }
        /** Listen events on current component and call passed function. **/
        B.components.BaseComponent.prototype.bind = function(eventName, callback, live){
            this.listen("#"+this.getId(), eventName, callback, live);
        }
        B.components.BaseComponent.prototype.trigger = function(eventName, opt_data, event){
            var e = $.Event(eventName);
            e.event = event;
            e.model = B.extend({}, this._model, opt_data||{});
            e.sender = this;
            e.currentSender = this;
            // trigger event
            $("#"+this._uid).trigger(e);
        }
        
        // --------------------------------------------------------------------
        //                   p r i v a t e
        // --------------------------------------------------------------------
        
        function _getName(text){
            try{
                var array = text.split("/"),
                last = array[array.length-1];
                return last.split(".")[0];
            }catch(err){}
            return "basecomponent";
        }
        
        function _initParent(compInstance, parent){
            //compInstance._parentId = parent?parent.replace("#", ""):"";
            var element = $(parent);
            compInstance._parentId = element?element.attr("id"):"";
            compInstance._parent = element?element[0]:"";
        }
        
    })();
    
    // ------------------------------------------------------------------------
    //                      Action Manager
    // ------------------------------------------------------------------------
    
    (function(){
        /**
         * ActionManager component is for centralized action management.
         * Usually you should use "B.Actions" singleton instance of ActionManager adding
         * here all default actions.
         * For ex. you can define a "checkout" action and call B.Actions.checkout()
         * to execute.
         * 
         * @constructor
         * @param opt_model
         */
        B.components.ActionManager = function(opt_model){
            opt_model = opt_model||{};
            
            B.components.Base.call(this, opt_model); 
        
            //-- internal fields --//
            opt_model.uuid = this.getId();
            opt_model._actions = new Array();
            
            // Set new model
            this.setModel(opt_model);
        }
        // inheritance
        B.inherits(B.components.ActionManager, B.components.Base);
        
        B.components.ActionManager.prototype.isEmpty = function() {
            var data = this.getModel();
            return data._actions.length===0;
        }
        
        /**
         * Add action to Action Manager
         * @param name {string}
         * @param func {function}
         */
        B.components.ActionManager.prototype.add = function(name,func) {
            var data = this.getModel(),
            actName = "_act_"+name;
            if(B.isFunction(func)){
                this[actName] = func;
                data._actions.push(actName);
            }
        }
        
        /**
         * 
         */
        B.components.ActionManager.prototype.call = function(name, opt_context, var_args) {
            var data = this.getModel(),
            actName = "_act_"+name,
            args = Array.prototype.slice.call(arguments, 2);
            if(B.indexOf(data._actions, actName)>-1){
                return this[actName].apply(opt_context||this, args);
            }
            return null;
        }
        
        B.components.ActionManager.prototype.exists = function(name){
            var data = this.getModel(),
            actName = "_act_"+name;
            
            return B.indexOf(data._actions, actName)>-1;
        }
        
    })();
    
    // creates singleton instance
    B.Actions = new B.components.ActionManager();
    
    // ------------------------------------------------------------------------
    //                      Events
    // ------------------------------------------------------------------------
    
    /**
     * B.Events singleton is a Base component containing 
     * a map of event listeners. 
     * You can add centralized events and listeners here.
     */
    
    //-- creates singleton instance --//
    B.Events = new B.components.Base();
    //-- declare some base events --//
    B.Events.ON_LOGIN = "onlogin";
    B.Events.ON_LOGOUT = "onlogout";
    B.Events.ON_UNLOAD = "onunload";
    //-- binding helpers --//
    B.Events.onLogin = function(func){
        if(B.isFunction(func)){
            B.Events.bind(B.Events.ON_LOGIN, func);
        }
    }
    B.Events.onLogout = function(func){
        if(B.isFunction(func)){
            B.Events.bind(B.Events.ON_LOGOUT, func);
        }
    }
    B.Events.onUnload = function(func){
        // browser close, user navigate away from the page
        if(B.isFunction(func)){
            B.Events.bind(B.Events.ON_UNLOAD, func);
        }
    }
    //-- trigger helpers --//
    B.Events.triggerLogin = function(opt_data){
        B.Events.trigger(B.Events.ON_LOGIN, opt_data);
    }
    B.Events.triggerLogout = function(opt_data){
        B.Events.trigger(B.Events.ON_LOGOUT, opt_data);
    }
    //-- trigger onUnload --//
    $(window).unload(function() {
        B.Events.trigger(B.Events.ON_UNLOAD);
    });
    

    // ------------------------------------------------------------------------
    //                      Declarations
    // ------------------------------------------------------------------------
    
    //-- implementation is into: "/macro/comp/loading/m_loading.js" --//
    B.components.loading = B.components.loading||{};
    B.components.loading.hide = B.components.loading.hide||function(){};
    B.components.loading.show = B.components.loading.show||function(){};
    
    
    
})(window, beeing, jQuery); 
