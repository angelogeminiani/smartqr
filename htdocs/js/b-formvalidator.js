(function(window, B, $, undefined) {
    
    // check namespace
    B.forms=B.forms||{};
    
    var ns = B.forms,
    // HTML5-compatible validation pattern library that can be extended and/or overriden.
    patternLibrary = { 
        // **TODO: password
        phone: /([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)/,

        // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
        email: /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/,

        // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/iri/
        url: /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,

        // Number, including positive, negative, and floating decimal. Credit: bassistance
        number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?/,

        // Date in ISO format. Credit: bassistance
        dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,

        alpha: /[a-zA-Z]+/,
        alphaNumeric: /\w+/,
        integer: /-?\d+/
    };
    
    /**
     * Form validator
     * @param {object} params:
     *                  - {array} forms: array of form selector
     *                  
     * usage:
     *      var  validator = new B.forms.Validator();;
     *      // init validator
     *      validator.addForm("myformId");
     *      // add constraint to check password
     *      validator.addConstraint("password", function(validator, field){
     *          return _checkPassword(field);
     *      });
     **/
    ns.Validator = function(params) {

        // fields
        this.data.forms = new Array(); // initialized forms
        this.data.fields = new Array(); // array of {form: formID, id:fieldID, pattern:fieldPattern}
        this.data.constraints = new B.HashMap(); // array of custom functions to run for validation
        
        // autoload <input> of forms
        if(params && params.forms){
            _initForms(this, params.forms);
        }
        
    }
    
    ns.Validator.prototype.data = {}; 

    ns.Validator.prototype.addForm = function(formId){
        _initForm(this, formId);
    };
    
    /**
     * Add field to internal list.
     * 
     * @param {string} fieldSelector
     * @param {string} opt_formid: (Optional) ID of form
     */
    ns.Validator.prototype.addField = function(fieldSelector, opt_formid){
        _initField(this, opt_formid, fieldSelector);
    };

    /**
     * Add custom constraint for validation
     * @param {string} key: Function identifier (required for remove)
     * @param {function} func: Custom function to run for validation.
     * This function should return null or error message.
     **/
    ns.Validator.prototype.addConstraint = function(key, func){
        _addConstraint(this, key, func);
    };
    
    ns.Validator.prototype.removeConstraint = function(key){
        _removeConstraint(this, key);
    };
    
    ns.Validator.prototype.getFieldById = function(fieldId){
        return _getFieldById(this, fieldId);
    }
    
    ns.Validator.prototype.getFieldByFormAndName = function(form, name){
        return _getFieldByFormAndName(this, form, name);
    }
    
    /**
     * Validate all forms.
     * @return Object {valid:boolean, errors:array}
     */
    ns.Validator.prototype.validateAll = function(){
        var forms = null!=this.data?this.data.forms:null,
        i, formResult,
        result = {};
        result.valid = true;
        result.errors = [];
        if(!B.isEmpty(forms)){
            for(i=0;i<forms.length;i++){
                formResult = this.validateForm(forms[i]);
                result.valid = result.valid&&formResult.valid;
                result.errors = B.merge(formResult.errors, result.errors);
            }
        }
        return result;
    };
    
    /**
     * Validate single form.
     * @param {string} formId: Form ID.
     * @return Object {valid:boolean, errors:array}
     */
    ns.Validator.prototype.validateForm = function(formId){
        var fields = _getFields(this, formId),
        i, fieldResult,
        result = {};
        result.valid = true;
        result.errors = [];
        if(!B.isEmpty(fields)){
            for(i=0;i<fields.length;i++){
                fieldResult = _validateField(this, fields[i]);
                result.valid = result.valid&&fieldResult.valid;
                result.errors = B.merge(fieldResult.errors, result.errors);
                _css(fieldResult, fields[i]);
            }
        }
        
        return result;
    }
    
    /**
     * Validate single field object.
     * @param {object, string} field: Use getField to obtain a valid field object.
     * You can pass both a field object or valid jQuery selector.
     * @return Object {valid:boolean, errors:array}
     */
    ns.Validator.prototype.validateField = function(field) {
        var result = {};
        result.valid = true;
        result.errors = [];
        if(field){
            if(B.isString(field)){
                var elems =  $(field),
                ffield = elems.length==1?_createFieldFromElem(null, elems[0]):null;
                if(ffield){
                    result = _validateField(this, ffield);
                    _css(result, ffield);
                }
            } else {
                result = _validateField(this, field);
                _css(result, field);
            } 
        }
        
        return result; 
    }
    // ------------------------------------------------------------------------
    //                      private
    // ------------------------------------------------------------------------
    
    function _addConstraint(compInstance, key, func){
        var data = compInstance.data;
        if(B.isFunction(func)){
            data.constraints.put(key, func);
        }
    }
    
    function _removeConstraint(compInstance, key){
        var data = compInstance.data;
        if(B.hastext(key)){
            data.constraints.remove(key);
        }
    }
    
    function _initForms(compInstance, forms){
        var i, form;
        for(i=0;i<forms.length;i++){
            form = forms[i];
            _initForm(compInstance, form);
        }
    }
    
    function _initForm(compInstance, form){
        var data = compInstance.data,
        formsel = B.startsWith(form, "#")?form:"#"+form;
        
        // add form and fields only if does not exists in internal forms
        if (B.indexOf(data.forms, form)===-1) {
            // add FORM
            data.forms.push(form);
            // check FORM fields
            $(formsel + " input").each(function(index, elem){
                _initField(compInstance, form, elem);
            });
        }
    }
    
    function _initField(compInstance, form, fieldElem){
        var data = compInstance.data,
        field = _createFieldFromElem(form, fieldElem);
        
        // add field
        if(!_fieldExists(compInstance, field)){
            data.fields.push(field);
            
            // init field css
            if(field.required){
                _cssRequired(field.elem);
            }

            // blur listener
            $(fieldElem).blur(function(e){
                _fieldChanged(compInstance, field);
            });
            // click listener 
            $(fieldElem).focus(function(e){
                _fadeOutTip(fieldElem);
            }); 
                
            
        }

        return field;
    }
    
    function _fieldChanged(compInstance, field){
        var response = _validateField(compInstance, field);
        _css(response, field);
    }

    function _createFieldFromElem(form, fieldElem){
        var 
        required = $(fieldElem).attr("required"),
        fform = null!=form?form:$(fieldElem).attr("form"),
        constraint = $(fieldElem).attr("constraint"),
        field = _createField(fieldElem, fform, required, constraint);
        return field;
    }
    
    function _createField(elem, form, required, constraint){
        var 
        id = elem.id,
        name = elem.name,
        type = elem.type,
        pattern = elem.pattern;
        
        if(!B.hasText(pattern)){
            pattern = patternLibrary[type];
        }

        return {
            uid: _getUID(form, id, name),
            id: id,
            name: name,
            form:form,
            elem: elem,
            type:type,
            pattern:pattern,
            constraint:constraint, // name of constraint to call
            min:elem.min,
            max:elem.max,
            required:null!=required?true:false
        }
    }
    
    function _fieldExists(compInstance, field){
        return null!=_getField(compInstance, field.uid);
    }
    
    function _getFieldById(compInstance, fieldId){
        if(B.hasText(fieldId)){
            var fields = compInstance.data.fields,
            i, item;
            for(i=0;i<fields.length;i++){
                item = fields[i];
                if(item.id===fieldId){
                    return item;
                }
            }
        }
        return null;
    }
    
    function _getFieldByFormAndName(compInstance, form, name){
        if(B.hasText(form)&&B.hasText(name)){
            var fields = compInstance.data.fields,
            i, item;
            for(i=0;i<fields.length;i++){
                item = fields[i];
                if(item.form===form&&item.name===name){
                    return item;
                }
            }
        }
        return null;
    }
    
    function _getField(compInstance, fieldUID){
        if(B.hasText(fieldUID)){
            var fields = compInstance.data.fields,
            i, item;
            for(i=0;i<fields.length;i++){
                item = fields[i];
                if(item.uid===fieldUID){
                    return item;
                }
            }
        }
        return null;
    }
    
    function _getFields(compInstance, formId){
        if(B.hasText(formId)){
            var fields = compInstance.data.fields,
            result = new Array(),
            fformId = B.replaceAll(formId, "#", ""),
            i, item;
            for(i=0;i<fields.length;i++){
                item = fields[i];
                if(item.form===fformId){
                    result.push(item);
                }
            }
            return result;
        }
        return new Array();
    }
    
    function _getUID(form, id, name){
        return (form||"") + (id||"") + (name||"");
    }
    
    function _validateConstraint(compInstance, field){
        if(field && field.constraint){
            var data = compInstance.data,
            constraints = data.constraints,
            func = constraints.get(field.constraint);
            if(B.isFunction(func)){
                return func.call(compInstance, compInstance, field);
            }
        }
        return null;
    }
    
    function _validateField(compInstance, field){
        var result = {};
        result.valid = true;
        result.errors = [];
        
        if(field && field.elem){
            var 
            pattern = field.pattern,
            min = field.min,
            max = field.max,
            elem = field.elem,
            value = $(elem).val(),
            constraintResponse;
            
            // required
            if(result.valid){
                if(field.required){
                    if(B.isNULL(value)){
                        result.valid = false;
                    }
                }  
            }

            // pattern
            if(result.valid){
                if(field.pattern){
                    if(!_validatePattern(pattern, value)){
                        result.valid = false;
                    }
                } 
            }

            // min
            if(result.valid){
                if(min){
                    if(field.type=="number"){
                        // check value
                        if(parseFloat(value)<parseFloat(min)){
                            result.valid = false;
                        }
                    } else {
                        // check length
                        if(value.toString().length<parseFloat(min)){
                            result.valid = false;
                        }
                    }
                } 
            }
            
            // constraint
            constraintResponse = _validateConstraint(compInstance, field);
            if(B.hasText(constraintResponse)){
                result.errors.push(constraintResponse);
            }

        }
        return result; 
    }
    
    function _validatePattern(pattern, value){
        // The pattern attribute must match the whole value, not just a subset:
        // "...as if it implied 
        // a ^(?: at the start of the pattern 
        // and a )$ at the end."
        var exp = B.isString(pattern)?new RegExp('^(?:' + pattern + ')$'):pattern;
        return exp.test(value);
    }
    
    function _fadeOutTip(elem){
        $("#MSG_"+elem.id).fadeOut("slow", function(){
            _removeTip(elem);
        });
    }
    
    function _removeTip(elem){
        $("#MSG_"+elem.id).remove();
    }
    
    function _showTip(elem, errors){
        // add error message as span
        var id = "MSG_" + elem.id,
        html = "<span id='"+id+"' class='validationerror'>" + errors + "</span>";
        $(elem).parent().append(html);
        // listener
        $("#"+id).hover(function(){
            _fadeOutTip(elem);
        });
    }
    
    function _css(response, field){
        var required = field.required;
        if(required){
            _cssElem(response, field.elem);
        }
    }
    function _cssElem(response, elem){
        if(response.valid && response.errors.length==0){
            _cssValid(elem);
        } else {
            _cssInvalid(elem);
            if(response.errors.length>0){
                // remove 
                _removeTip(elem);
                // add
                _showTip(elem, response.errors);
            }
        }
    }
    
    function _cssValid(elem){
        $(elem).parent().removeClass("invalid");
        $(elem).parent().removeClass("required");

        if(!$(elem).parent().hasClass("valid")){
            $(elem).parent().addClass("valid");
        }
        // remove error message
        $("#MSG_"+elem.id).remove();
    }
    
    function _cssInvalid(elem){
        $(elem).parent().removeClass("valid");
        $(elem).parent().removeClass("required");
        
        if(!$(elem).parent().hasClass("invalid")){
            $(elem).parent().addClass("invalid");
        }
    }
    
    function _cssRequired(elem){
        $(elem).parent().removeClass("invalid");
        $(elem).removeClass("valid");
        
        if(!$(elem).parent().hasClass("required")){
            $(elem).parent().addClass("required");
        }
        // remove error message
        $("#MSG_"+elem.id).remove();
    }
// ------------------------------------------------------------------------
//                      EXIT
// ------------------------------------------------------------------------
    
})(window, beeing, jQuery);