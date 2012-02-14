/*
	tabSlideOut v1.3 patched (edited in 2011-oct.-06)
	
	By Gian Angelo Geminiani: http://www.smartfeeling.org
        License:
	http://www.gnu.org/licenses/gpl.html
	
	patch based on original work tabSlideOut v1.3
        By William Paoli: http://wpaoli.building58.com

---------------------------------------------------
    To use you must have an image ready to go as your tab
    Make sure to pass in at minimum the path to the image and its dimensions:
    
    example:
    
        $('.slide-out-div').tabSlideOut({
                tabHandle: '.handle',                         //class of the element that will be your tab -doesnt have to be an anchor
                pathToTabImage: 'images/contact_tab.gif',     //relative path to the image for the tab
                imageHeight: '133px',                         //height of tab image
                imageWidth: '44px',                           //width of tab image   
        });

    or you can leave out these options
    and set the image properties using css
	
HEAD ---------------------------------
        <script type="text/javascript">
            $(function(){
                $('.slide-out-div').tabSlideOut({
                    tabHandle: '.handle',                     //class of the element that will become your tab
                    pathToTabImage: 'images/contact_tab.gif', //path to the image for the tab //Optionally can be set using css
                    imageHeight: '122px',                     //height of tab image           //Optionally can be set using css
                    imageWidth: '40px',                       //width of tab image            //Optionally can be set using css
                    tabLocation: 'left',                      //side of screen where tab lives, top, right, bottom, or left
                    tabPosition: null,                        // optional 'middle'
                    speed: 300,                               //speed of animation
                    action: 'click',                          //options: 'click' or 'hover', action to trigger animation
                    topPos: '200px',                          //position from the top/ use if tabLocation is left or right. optionally 'middle'
                    leftPos: '20px',                          //position from left/ use if tabLocation is bottom or top. optionally 'middle'
                    fixedPosition: false                      //options: true makes it stick(fixed position) on scroll
                });

            });
        </script>
    
CSS ----------------------------------
	<style type="text/css">
          .slide-out-div {
              padding: 20px;
              width: 250px;
              background: #ccc;
              border: 1px solid #29216d;
          }      
        </style>
	  
PAGE ---------------------------------
	<div class="slide-out-div">
            <div class="handle">
                <a class="handle-link" href="http://link-for-non-js-users.html">Content</a>
                <span class="handle-text">Text</span>
            </div>
            <h3>Contact me</h3>
            <p>Thanks for checking out my jQuery plugin, I hope you find this useful.
            </p>
            <p>This can be a form to submit feedback, or contact info</p>
        </div>	
*/


(function($){
    $.fn.tabSlideOut = function(callerSettings) {
        callerSettings = callerSettings||{};
        // extend settings
        var settings = $.extend({
            tabHandle: '.handle',
            speed: 300, 
            action: 'click',
            tabLocation: 'left',
            tabPosition: null, // optional 'middle'
            topPos: '200px',
            leftPos: '20px',    // optional 'middle'
            fixedPosition: false,
            positioning: 'absolute',
            pathToTabImage: null,
            imageHeight: null,
            imageWidth: null,
            onLoadSlideOut: false                       
        }, callerSettings);
        
        settings.tabHandle = $(settings.tabHandle);
        var obj = this;
        if (settings.fixedPosition === true) {
            settings.positioning = 'fixed';
        } else {
            settings.positioning = 'absolute';
        }
        
        //ie6 doesn't do well with the fixed option
        if (document.all && !window.opera && !window.XMLHttpRequest) {
            settings.positioning = 'absolute';
        }

        //set initial tabHandle css
        /* replaced from patch
        if (settings.pathToTabImage != null) {
            settings.tabHandle.css({
                'background' : 'url('+settings.pathToTabImage+') no-repeat',
                'width' : settings.imageWidth,
                'height': settings.imageHeight
            });
        }
        
        settings.tabHandle.css({ 
            'display': 'block',
            'textIndent' : '-99999px',
            'outline' : 'none',
            'position' : 'absolute'
        });
        */
        
        //-- START PATCH (replace existing) ---//
        var handleclass = settings.tabHandle.attr("class");
        settings.tabHandle.css({ 
            'display': 'block',
            'outline' : 'none',
            'position' : 'absolute'
        });
	
        if (settings.pathToTabImage != null) {
            $("."+handleclass+"-link", settings.tabHandle).css({
                'background' : 'url('+settings.pathToTabImage+') no-repeat',
                'width' : settings.imageWidth + 'px',
                'height': settings.imageHeight + 'px'
            });
        }
	
        $("."+handleclass+"-link", settings.tabHandle).css({ 
            'display': 'block',
            'textIndent' : '-99999px',
            'outline' : 'none',
            'position' : 'absolute'
        });
		
        $("."+handleclass+"-text", settings.tabHandle).css({ 
            'display': 'block',
            'position' : 'absolute',
            'padding' : '5px'
        });
        
        //-- END PATCH (replace existing) ---//
        
        obj.css({
            'line-height' : '1',
            'position' : settings.positioning
        });

        
        var properties = {
            containerWidth: parseInt(obj.outerWidth(), 10) ,
            containerHeight: parseInt(obj.outerHeight(), 10) ,
            tabWidth: parseInt(settings.tabHandle.outerWidth(), 10) ,
            tabHeight: parseInt(settings.tabHandle.outerHeight(), 10) 
        };

        //set calculated css
        // -------------------------------------------------------------------
        //          TOP - BOTTOM
        // -------------------------------------------------------------------
        if(settings.tabLocation === 'top' || settings.tabLocation === 'bottom') {
            if(settings.leftPos==='middle'){
                // center horizzontaly
                obj.css({
                    'left' : '50%', 
                    'margin-left': '-' + (properties.containerWidth/2) + 'px'
                });
            } else {
                obj.css({
                    'left' : settings.leftPos
                });
            }
            settings.tabHandle.css({
                'right' : settings.tabPosition==='middle'?(properties.containerWidth/2) + (settings.imageWidth/2) + 'px':settings.imageWidth + 'px'
            });
        }
        
        if(settings.tabLocation === 'top') {
            obj.css({
                'top' : '-' + properties.containerHeight + 'px'
            });
            settings.tabHandle.css({
                'bottom' : '-' + properties.tabHeight + 'px'
            });
        }

        if(settings.tabLocation === 'bottom') {
            obj.css({
                'bottom' : '-' + properties.containerHeight + 'px', 
                'position' : 'fixed'
            });
            settings.tabHandle.css({
                'top' : '-' + properties.tabHeight + 'px'
            });
            
        }
        
        // -------------------------------------------------------------------
        //          LEFT - RIGHT
        // -------------------------------------------------------------------
        
        if(settings.tabLocation === 'left' || settings.tabLocation === 'right') {
            obj.css({
                //'height' : properties.containerHeight + 'px',
                'top' : settings.topPos
            });
            
            settings.tabHandle.css({
                'top' : settings.tabPosition==='middle'?(properties.containerHeight/2) - (settings.imageHeight/2) + 'px':0 + 'px'
            });
        }
        
        if(settings.tabLocation === 'left') {
            obj.css({
                'left': '-' + properties.containerWidth + 'px'
            });
            settings.tabHandle.css({
                'right' : '-' + properties.tabWidth + 'px'
            });
        }

        if(settings.tabLocation === 'right') {
            obj.css({
                'right': '-' + properties.containerWidth + 'px'
            });
            settings.tabHandle.css({
                'left' : '-' + properties.tabWidth + 'px'
            });
            
            $('html').css('overflow-x', 'hidden');
        }

        //functions for animation events
        
        settings.tabHandle.click(function(event){
            event.preventDefault();
        });
        
        var slideIn = function() {
            
            if (settings.tabLocation === 'top') {
                obj.animate({
                    top:'-' + properties.containerHeight + 'px'
                }, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'left') {
                obj.animate({
                    left: '-' + properties.containerWidth + 'px'
                }, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'right') {
                obj.animate({
                    right: '-' + properties.containerWidth + 'px'
                }, settings.speed).removeClass('open');
            } else if (settings.tabLocation === 'bottom') {
                obj.animate({
                    bottom: '-' + properties.containerHeight + 'px'
                }, settings.speed).removeClass('open');
            }    
            
        };
        
        var slideOut = function() {
            
            if (settings.tabLocation == 'top') {
                obj.animate({
                    top:'-3px'
                },  settings.speed).addClass('open');
            } else if (settings.tabLocation == 'left') {
                obj.animate({
                    left:'-3px'
                },  settings.speed).addClass('open');
            } else if (settings.tabLocation == 'right') {
                obj.animate({
                    right:'-3px'
                },  settings.speed).addClass('open');
            } else if (settings.tabLocation == 'bottom') {
                obj.animate({
                    bottom:'-3px'
                },  settings.speed).addClass('open');
            }
        };

        var clickScreenToClose = function() {
            obj.click(function(event){
                event.stopPropagation();
            });
            
            $(document).click(function(){
                slideIn();
            });
        };
        
        var clickAction = function(){
            settings.tabHandle.click(function(event){
                if (obj.hasClass('open')) {
                    slideIn();
                } else {
                    slideOut();
                }
            });
            
            clickScreenToClose();
        };
        
        var hoverAction = function(){
            obj.hover(
                function(){
                    slideOut();
                },
                
                function(){
                    slideIn();
                });
                
            settings.tabHandle.click(function(event){
                if (obj.hasClass('open')) {
                    slideIn();
                }
            });
            clickScreenToClose();
                
        };
        
        var slideOutOnLoad = function(){
            slideIn();
            setTimeout(slideOut, 500);
        };
        
        //choose which type of action to bind
        if (settings.action === 'click') {
            clickAction();
        }
        
        if (settings.action === 'hover') {
            hoverAction();
        }
        
        if (settings.onLoadSlideOut) {
            slideOutOnLoad();
        }
        
        // add reference for external call to callerSettings
        callerSettings.reference = {};
        callerSettings.reference.slideIn = slideIn;
        callerSettings.reference.slideOut = slideOut;
    };
})(jQuery);
