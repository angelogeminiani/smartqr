(function(window, B, $, undefined) {
    
    // check namespace
    B.ui = B.ui||{};
    var ns = B.ui;
    
    // ------------------------------------------------------------------------
    //                      Utils
    // ------------------------------------------------------------------------
    
    ns.clientWidth = function(/*string*/selector) {
        try{
            return $(selector)[0].clientWidth;
        }catch(err){}
        return 0;
    };
    
    ns.scrollWidth = function(/*string*/selector) {
        try{
            return $(selector)[0].scrollWidth;
        }catch(err){}
        return 0;
    };
    
    ns.scrollHorizontal = function(/*string*/selector) {
        try{
            var w = ns.clientWidth(selector),
            sw = ns.scrollWidth(selector);
            return w<sw;
        }catch(err){}
        return false;
    };
    
    ns.clientHeight = function(/*string*/selector) {
        try{
            return $(selector)[0].clientHeight;
        }catch(err){}
        return 0;
    };
    
    ns.scrollHeight = function(/*string*/selector) {
        try{
            return $(selector)[0].scrollHeight;
        }catch(err){}
        return 0;
    };
    
    ns.scrollVertical = function(/*string*/selector) {
        try{
            var h = ns.clientHeight(selector),
            sh = ns.scrollHeight(selector);
            return h<sh;
        }catch(err){}
        return false;
    };
    
    ns.isVisible = function(element){
        return $(element).is(":visible");
    };
    
    
    // ------------------------------------------------------------------------
    //                      Scroll History
    // ------------------------------------------------------------------------
    
    /**
     * 
     */
    ns.ScrollHistory = function() {
        var self = this,
        history = new B.HashMap();
        
        // Add an element to internal map
        // @param elem The element
        self.add = function (elem) {
            try{
                if(elem === window){
                    history.put(elem, {
                        x:window.scrollX||0, 
                        y:window.scrollY||0
                    });
                } else {
                    history.put(elem, {
                        x:ns.scrollWidth(elem), 
                        y:ns.scrollHeight(elem)
                    });
                }
            }catch(err){
                B.error(err);
            }
        }
        
        self.back = function() {
            try {
                var count = history.size(),
                i, item;
                // scroll back items
                for(i=0; i<count; i++){
                    item = history.getAt(i);
                    if(item.key === window){
                        window.scrollTo(item.value.x, item.value.y);
                    } else {
                        $(item.key).scrollLeft(item.value.x);
                        $(item.key).scrollTop(item.value.y);
                    }
                }
                // reset history
                history.clear();
            }catch(err){
                B.error(err);
            }
        };
    };
    
    // ------------------------------------------------------------------------
    //                      Overriding Page
    // ------------------------------------------------------------------------
    
    /**
     * Open a page loading content and hide previous content
     * @param options {object}
     *          - closable {boolean}
     *          - parent {string}
     *          - content {string}{function}{object}
     *              {string} If string is HTML to load
     *              {function} If function, is executed before onopen
     *              {object} If object can have 3 optional field:
     *                  - html: HTML text to load
     *                  - url: URL to load html from (i.e. "/pages/page.vhtml #content")
     *                  - func: FUNCTION to run
     *          - hide {string}{node} Selector to object to hide
     *          - onload {function}
     *          - onopen {function}
     *          - onclose {function}
     */
    ns.Page = function(/*object*/ options) {
        try{
            var closable=options.closable,
            parent=options.parent||"body",
            content = options.content||"",
            hide = options.hide,
            onload = options.onload,
            onopen = options.onopen,
            onbeforeclose = options.onbeforeclose,
            onclose = options.onclose,
            id_pagecontainer = "page-container",
            existing = $("#"+id_pagecontainer),
            // get or create a container element
            container = existing.length===0
            ? $(B.format("<div id='{0}' class='page'><a class='close' href='#'>CLOSE</a><div class='page-content'></div></div>", id_pagecontainer))
            : existing[0];
            
            // onload
            if(B.isFunction(onload)){
                onload();
            }
            
            // hide 
            if(hide){
                $(hide).hide();
            }

            // need append container?
            if(existing.length===0){
                $(container).appendTo(parent);
                /* localization */
                $(".close", container).text(Q.i18n.close);
                /* button style */
                $(".close", container).button();  
            }
        
            /* event */
            $(".close", container).bind("click", function(){
                // remove listener
                $(".close", container).unbind("click");
                // onBeforeClose
                if(B.isFunction(onbeforeclose)){
                    if(B.isFalse( onbeforeclose() )) {// synch
                        return false;
                    } 
                }
                // hide page content
                //$(parent).children().remove();
                if(parent==="body"){
                    $(content).hide();
                } else {
                    $(parent).hide();
                }
                if(hide){
                    $(hide).show();
                }
                // onClose
                if(B.isFunction(onclose)){
                    B.setTimeout(onclose, 100); // asynch
                }
                return false;
            });
                
            // add content to container
            if(B.isString(content)){
                // HTML
                $(".page-content",container).html(content);
            } else if(B.isFunction(content)) {
                // FUNCTION
                content();
            } else {
                // OBJECT
                if(content.html){
                    // HTML
                    $(".page-content",container).html(content.html);
                } else if(content.url){
                    // URL
                    $(".page-content").load(content.url);
                } else if (content.func){
                    // FUNCTION
                    content.func();
                }
            }
        
            // on-open event
            if(B.isFunction(onopen)){
                onopen();
            }
            
            if(parent==="body"){
                $(content).show();
            } else {
                $(parent).show();
            }
        }catch(err){
            B.log(err);
        }
    };
    
    
})(window, beeing, jQuery);