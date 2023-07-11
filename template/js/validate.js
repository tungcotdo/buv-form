Validator.errRequiredMsg = 'This field is required / Vui lòng không để trống thông tin này!';
Validator.allowFileExtension =  ['jpg', 'jpeg', 'png'];
Validator.maxFileSizeMB = 2;
Validator.maxFileSize = 1000000 * Validator.maxFileSizeMB;

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
                    : msg  || 'The e-mail address entered is invalid / Địa chỉ email không hợp lệ!';
        }
    };
}

Validator.tbRequired = function({selector, msg}) {
    return {
        type: 'tb',
        selector: selector,
        test: function( element, formElement ){
            return element.value.trim() 
                    ? undefined 
                    : msg  || Validator.errRequiredMsg;
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
                errMsg = Validator.errRequiredMsg;
            }else{
                var fileSize = element.files[0].size;
                var maxFileSize = size ? size * 1000000 : Validator.maxFileSize;
                var fileExtension = Validator.getFileExtension(element);
                var allowExtension = extension ? extension : Validator.allowFileExtension;
                if( !allowExtension.includes(fileExtension) ){
                    errMsg = 'File extention must be: ' + allowExtension.join(' | ') + ''; 
                }else if( fileSize >  maxFileSize){
                    var msgFileSize = size ? size : Validator.maxFileSizeMB;
                    errMsg = 'File upload must be less than ' + msgFileSize + 'MB!';                
                }
            }

            return errMsg;
        }
    };
}

Validator.rbRequired = function({selector, msg}) {
    return {
        type: 'rb',
        selector: selector,
        test: function( element, formElement ){
            let rbElements = formElement.querySelectorAll(selector);
            let rbCheckFlag = false;
            rbElements.forEach( rbE => {
                if( rbE.checked == true )
                    rbCheckFlag = true;
            });

            return rbCheckFlag 
                    ? undefined 
                    : msg  || Validator.errRequiredMsg;
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
                    : msg || 'The number must be greater than 0 / Số phải lớn hơn 0!';
        }
    };
}

Validator.cbChecked = function ({selector, msg}) {
    return {
        type: 'cb',
        selector: selector,
        test: function( element, formElement ){
            
            function isChecked(cbs){
                var checkedFlag = false;
                cbs.forEach(cb => {
                    if (cb.checked) {
                        checkedFlag = true;
                    }
                });
                return checkedFlag;
            }

            var cbs = element.querySelectorAll('input[type="checkbox"]');

            return isChecked(cbs) 
                    ? undefined 
                    : msg || Validator.errRequiredMsg;
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
                    : msg || 'Please enter day/month/year / Vui lòng nhập ngày/tháng/năm!';
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
                    : msg || Validator.errRequiredMsg;
        }
    };
}

Validator.getFileExtension = function( element ){
    var fileName = element.files[0].name;
    return fileName.split('.').pop();
}

function Validator( options ) {
    var formElement = document.querySelector(options.form);

    formElement.onsubmit = function(e){
        e.preventDefault();
        var flagSubmit = true;
        var viewInvalidElement = null;
        options.rules.forEach( rule => {
           var elements = formElement.querySelectorAll(rule.selector);
            elements.forEach( element => {
                if( element ){
                    var isFormValid = validate(element, customRules[rule.selector]);
                    if( isFormValid !== undefined ){
                        flagSubmit = false;
                        viewInvalidElement = element;
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
            viewInvalidElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }

    function validate(element, rule){
        var errMsg;
        for( var i = 0; i < rule.length; i++ ){
            errMsg = rule[i](element, formElement);
            if( errMsg !== undefined ) break;
        }

        var validateElement = element.closest('.validate');
        var errMsgElement = validateElement.querySelector('.error-message');

        if( errMsg ) {
            errMsgElement.innerText = errMsg;
            validateElement.classList.remove('valid');
            validateElement.classList.add('invalid');
        }else{
            errMsgElement.innerText = '';
            validateElement.classList.remove('invalid');
            validateElement.classList.add('valid');
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
                                validate(element, customRules[rule.selector]);
                            });
                        });
                      break;
                    case 'bd':
                        var slbs = element.querySelectorAll('select');
                        slbs.forEach(slb => {
                            slb.addEventListener("change", function(){ 
                                validate(element, customRules[rule.selector]);
                            });
                        });
                      break;
                    case 'fi':
                        element.onchange = function(){
                            validate(element, customRules[rule.selector]);
                        }
                    case 'slb':
                        element.onchange = function(){
                            validate(element, customRules[rule.selector]);
                        }
                    break;
                    default:
                        element.onblur = function(){
                            validate(element, customRules[rule.selector]);
                        }
                }

            });

        });
    }
}