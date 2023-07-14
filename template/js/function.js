Validator.constMsgRequired = 'This field is required / Vui lòng không để trống thông tin này!';
Validator.constMsgOneOption = 'You must select at least one option/ Bạn phải lựa chọn ít nhất một option!';
Validator.constMsgAllowFileExt = 'File extention allow/ Đuôi mở rộng cho phép';
Validator.constMsgAllowFileSize = 'File upload must not be over/ Dung lượng không được vượt quá';
Validator.constMsgEmailFormat = 'The e-mail address entered is invalid / Địa chỉ email không hợp lệ!';

Validator.constFileExt =  ['jpg', 'jpeg', 'png'];
Validator.constFileSizeMB = 2; // Alow max file size <= 2MB
Validator.constFileSize = 1000000 * Validator.constFileSizeMB;

function Validator( options ) {
    var formElement = document.querySelector(options.form);

    formElement.onsubmit = function(e){
        e.preventDefault();
        var flagSubmit = true;
        var viewInvalidElement = [];
        
        options.rules.forEach( rule => {
           var elements = formElement.querySelectorAll(rule.selector);
            elements.forEach( element => {
                if( element ){
                    var isFormValid = validate(element, customRules[rule.selector], rule.error);
                    if( isFormValid !== undefined ){
                        flagSubmit = false;
                        var scrollPosition = rule.error 
                                                ? document.querySelector(rule.error) 
                                                : element.closest('.validate').querySelector('.error-message');

                        viewInvalidElement.push(scrollPosition);
                    }
                }
            });
        });

        if( flagSubmit ){
            var responses = {};
            responses.form = formElement;
            var datas = formElement.querySelectorAll('input[name]');
            datas.forEach( data => {
                responses[data.name] = data.value;
            });
            options.onSubmit(responses);
        }else{
            viewInvalidElement[0].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }

    function validate(element, rule, error){
        var errMsg;

        for( var i = 0; i < rule.length; i++ ){
            errMsg = rule[i](element, formElement);
            if( errMsg !== undefined ) break;
        }

        var validateElement = element.closest('.validate');
        var errorMsgElement = error ? document.querySelector(error) : validateElement.querySelector('.error-message');

        if( errMsg){
            validateElement.classList.add('invalid');
            validateElement.classList.remove('valid');
            errorMsgElement.innerText = errMsg;
        }else{
            validateElement.classList.add('valid');
            validateElement.classList.remove('invalid');
            errorMsgElement.innerText = '';
        }

        return errMsg;
    }

    if( options.rules ){

        var customRules = [];
        options.rules.forEach( rule => {
            if(Array.isArray( customRules[rule.selector] )){
                customRules[rule.selector].push(rule.test);
            }else{
                customRules[rule.selector] = [rule.test];
            }
            
            var elements = formElement.querySelectorAll(rule.selector);
            elements.forEach( element => {

                switch(rule.type) {
                    case 'cb':
                        var cbs = element.querySelectorAll('input[type="checkbox"]');
                        cbs.forEach(cb => {
                            cb.addEventListener("click", function(){ 
                                validate(element, customRules[rule.selector], rule.error);
                            });
                        });
                      break;
                    case 'rb':
                        element.addEventListener("click", function(){ 
                            validate(element, customRules[rule.selector], rule.error);
                        });
                        break;
                    case 'bd':
                        var slbs = element.querySelectorAll('select');
                        slbs.forEach(slb => {
                            slb.addEventListener("change", function(){ 
                                validate(element, customRules[rule.selector], rule.error);
                            });
                        });
                      break;
                    case 'fi':
                        element.onchange = function(){
                            validate(element, customRules[rule.selector], rule.error);
                        }
                    case 'slb':
                        element.onchange = function(){
                            validate(element, customRules[rule.selector], rule.error);
                        }
                    break;
                    default:
                        element.onblur = function(){
                            validate(element, customRules[rule.selector], rule.error);
                        }
                }

            });

        });
    }
}

Validator.email = function({selector, msg}) {
    checkEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    return {
        type: 'tb',
        selector: selector,
        test: function( element, formElement ){
            return checkEmail(element.value) 
                    ? undefined 
                    : msg  
                    || Validator.constMsgEmailFormat;
        }
    };
}

Validator.tbRequired = function({selector, msg, error}) {
    return {
        type: 'tb',
        selector: selector,
        error: error,
        test: function( element, formElement ){
            return element.value.trim()
                    ? undefined 
                    : msg 
                    || Validator.constMsgRequired;
        }
    };
}

Validator.tbRequiredWhenCbChecked = function({selector, checkbox, msg, error}) {
    var checkboxes = document.querySelectorAll(checkbox);
    checkboxes.forEach( cb => {
        cb.addEventListener("click", function(){ 
            document.querySelector(error).innerText = '';
            var textboxElement = document.querySelector(selector);
            textboxElement.value = '';
            textboxElement.closest('.validate').classList.remove('invalid', 'valid');
        });
    });

    return {
        type: 'tb',
        selector: selector,
        error: error,
        test: function( element, formElement ){
            return Functions.cbChecked(checkboxes) && !element.value.trim()
                    ? msg 
                    || Validator.constMsgRequired 
                    : undefined;
        }
    };
}

Validator.tbRequiredWhenRbChecked = function({selector, radiobox, msg, error}) {
    var radioboxes = document.querySelectorAll(radiobox);
    radioboxes.forEach( cb => {
        cb.addEventListener("click", function(){ 
            if( error ){
                document.querySelector(error).innerText = '';
            }
            
            var radioboxElement = document.querySelector(selector);
            radioboxElement.value = '';
            radioboxElement.closest('.validate').classList.remove('invalid', 'valid');
        });
    });

    return {
        type: 'tb',
        selector: selector,
        error: error,
        test: function( element, formElement ){
            return Functions.rbChecked(radioboxes) && !element.value.trim()
                    ? msg 
                    || Validator.constMsgRequired 
                    : undefined;
        }
    };
}

Validator.fileRequiredWhenCbChecked = function({selector, size, extension, checkbox, error}) {
    var checkboxes = document.querySelectorAll(checkbox);
    checkboxes.forEach( cb => {
        cb.addEventListener("click", function(){ 
            document.querySelector(error).innerText = '';
            var fileElement = document.querySelector(selector);
            fileElement.value = '';
            fileElement.closest('.validate').classList.remove('invalid', 'valid');
        });
    });

    return {
        type: 'fi',
        selector: selector,
        error: error,
        test: function( element, formElement ){

            var errMsg = undefined;
            if(  Functions.cbChecked(checkboxes) && element.value.trim() ){
                var fileSize = element.files[0].size;
                var allowFileSize = size ? size * 1000000 : Validator.constFileSize;
                var fileExtension = Functions.getFileExtension(element);
                var allowExtension = extension ? extension : Validator.constFileExt;
                if( !allowExtension.includes(fileExtension) ){
                    errMsg = Validator.constMsgAllowFileExt + '(' + allowExtension.join(' | ') + ')'; 
                }else if( fileSize >  allowFileSize){
                    var msgFileSize = size ? size : Validator.constFileSizeMB;
                    errMsg = Validator.constMsgAllowFileSize + '(' + msgFileSize + 'MB)';                
                }
            }else{
                errMsg = Validator.constMsgRequired;
            }

            return errMsg;
        }
    };
}

Validator.fileRequiredWhenRbChecked = function({selector, size, extension, radiobox, error}) {
    var radioboxes = document.querySelectorAll(radiobox);
    radioboxes.forEach( rb => {
        rb.addEventListener("click", function(){ 
            if( error ){
                document.querySelector(error).innerText = '';
            }
            var fileElement = document.querySelector(selector);
            fileElement.value = '';
            fileElement.closest('.validate').classList.remove('invalid', 'valid');
        });
    });

    return {
        type: 'fi',
        selector: selector,
        error: error,
        test: function( element, formElement ){

            var errMsg = undefined;
            if( Functions.rbChecked(radioboxes) ){
                if( element.value.trim() ){
                    var fileSize = element.files[0].size;
                    var allowFileSize = size ? size * 1000000 : Validator.constFileSize;
                    var fileExtension = Functions.getFileExtension(element);
                    var allowExtension = extension ? extension : Validator.constFileExt;
                    if( !allowExtension.includes(fileExtension) ){
                        errMsg = Validator.constMsgAllowFileExt + '(' + allowExtension.join(' | ') + ')';
                    }else if( fileSize >  allowFileSize){
                        var msgFileSize = size ? size : Validator.constFileSizeMB;
                        errMsg = Validator.constMsgAllowFileSize + '(' + msgFileSize + 'MB)';                
                    }
                }else{
                    errMsg = Validator.constMsgRequired;
                }
            }

            return errMsg;
        }
    };
}

Validator.file = function({selector, size, extension}) {
    return {
        type: 'fi',
        selector: selector,
        test: function( element, formElement ){

            var errMsg = undefined;
            if( !element.value.trim() ){
                errMsg = Validator.constMsgRequired;
            }else{
                var fileSize = element.files[0].size;
                var allowFileSize = size ? size * 1000000 : Validator.constFileSize;
                var fileExtension = Functions.getFileExtension(element);
                var allowExtension = extension ? extension : Validator.constFileExt;
                if( !allowExtension.includes(fileExtension) ){
                    errMsg = 'File extention allow/ Đuôi mở rộng cho phép (' + allowExtension.join(' | ') + ')';  
                }else if( fileSize >  allowFileSize){
                    var msgFileSize = size ? size : Validator.constFileSizeMB;
                    errMsg = 'File upload must not be over/ Dung lượng tệp tin không được vượt quá (' + msgFileSize + 'MB)';                 
                }
            }

            return errMsg;
        }
    };
}

Validator.rbRequired = function({selector, msg, error}) {
    return {
        type: 'rb',
        selector: selector,
        error: error,
        test: function( element, formElement ){
            let rbElements = formElement.querySelectorAll(selector);
            let rbCheckFlag = false;
            rbElements.forEach( rbE => {
                if( rbE.checked == true )
                    rbCheckFlag = true;
            });

            return rbCheckFlag 
                    ? undefined 
                    : msg  
                    || Validator.constMsgRequired;
        }
    };
}

Validator.isPInt = function({selector, msg}) {
    return {
        type: 'tb',
        selector: selector,
        test: function( element, formElement ){

            return parseInt(element.value) > 0 || !element.value.trim() 
                    ? undefined 
                    : msg 
                    || 'The number must be greater than 0 / Số phải lớn hơn 0!';
        }
    };
}

Validator.cbChecked = function ({selector, msg, error}) {
    return {
        type: 'cb',
        selector: selector,
        error: error,
        test: function( element, formElement ){
            var cbs = element.querySelectorAll('input[type="checkbox"]');

            return Functions.cbChecked(cbs) 
                    ? undefined 
                    : msg 
                    || Validator.constMsgRequired;
        }
    };
}

Validator.bdRequired = function ({selector, msg}){
    return {
        type: 'bd',
        selector: selector,
        test: function( element, formElement ){
            
            function isSelected(slbs){
                var checkedFlag = true;
                slbs.forEach(sl => {
                    if ( sl.value == null || sl.value == '' || sl.value == undefined ) {
                        checkedFlag = false;
                    }
                });
                return checkedFlag;
            }

            var slbs = element.querySelectorAll('select');
            return isSelected(slbs) 
                    ? undefined 
                    : msg 
                    || 'Please enter day/month/year / Vui lòng nhập ngày/tháng/năm!';
        }
    };
}

Validator.slbRequired = function ({selector, msg}){
    return {
        type: 'slb',
        selector: selector,
        test: function( element, formElement ){
            console.log(element.value);
            return  element.value
                    ? undefined 
                    : msg 
                    || Validator.constMsgRequired;
        }
    };
}

// Function
var Functions = {

    getFileExtension : function( element ){
        var fileName = element.files[0].name;
        return fileName.split('.').pop();
    },
    cbChecked : function(cbs){
        var checkedFlag = false;
        cbs.forEach(cb => {
            if (cb.checked) {
                checkedFlag = true;
            }
        });
        return checkedFlag;
    },
    rbChecked : function(rds){
        var checkedFlag = false;
        rds.forEach(rb => {
            if (rb.checked) {
                checkedFlag = true;
            }
        });
        return checkedFlag;
    },
    rbShowHide : function({rbClass, eID, status}){
        // Element show or hide by default
        var e = document.getElementById(eID);
        e.style.display = ( status ) ? 'block' : 'none';
    
        // Check
        var rbs = document.querySelectorAll('.' + rbClass);
        rbs.forEach(rb => {
            rb.addEventListener("click", function(){ 
                e.style.display = ( rb.value == 1 ) ? 'block' : 'none';
            });
        });
    
        e.scrollIntoView();
    },
    cbShowHide : function({cbClass, eID, status}){
        var e = document.getElementById(eID);
        // Element show or hide by default
        e.style.display = ( status ) ? 'block' : 'none';
    
        var cbs = document.querySelectorAll('.' + cbClass);
    
        cbs.forEach(cb => {
            cb.addEventListener("click", function(){ 
                e.style.display = Functions.cbChecked(cbs) ? 'block' : 'none';
            });
        });
    
        e.scrollIntoView();
    }
};

