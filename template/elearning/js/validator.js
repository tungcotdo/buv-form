Validator.message = {
    'required'  : 'Vui lòng không để trống thông tin này!',
    'option'    : 'Bạn phải lựa chọn ít nhất một option!',
    'extension' : 'Đuôi mở rộng cho phép ',
    'size'      : 'Dung lượng không được vượt quá ',
    'email'     : 'Địa chỉ email không hợp lệ!'
}

function Validator( options ) {
    var form = document.querySelector(options.form);

    form.onsubmit = function(e){
        e.preventDefault();

        var isFormSubmit = true;
        var scrollToInvalidElement = [];
        
        options.rules.forEach( rule => {
           var elements = form.querySelectorAll(rule.selector);
            elements.forEach( element => {
                if( element ){
                    var isFormValid = validate(element, customRules[rule.selector], rule.error);
                    if( isFormValid !== undefined ){
                        isFormSubmit = false;
                        var scrollPosition = rule.error ? document.querySelector(rule.error) : element.closest('.validate').querySelector('.message__error');
                        scrollToInvalidElement.push(scrollPosition);
                    }
                }
            });
        });

        if( isFormSubmit ){
            var responses = {};
            responses.form = form;
            var datas = form.querySelectorAll('input[name]');
            datas.forEach( data => {
                responses[data.name] = data.value;
            });
            options.onSubmit(responses);
        }else{
            scrollToInvalidElement[0].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }

    function validate(element, rule, error){
        var messageError;

        for( var i = 0; i < rule.length; i++ ){
            messageError = rule[i](element, form);
            if( messageError !== undefined ) break;
        }
        
        var errorMsgElement = error ? document.querySelector(error) : element.closest('.validate').querySelector('.message__error');

        if( messageError){
            element.closest('.validate').classList.add('invalid');
            element.closest('.validate').classList.remove('valid');
            errorMsgElement.innerText = messageError;
        }else{
            element.closest('.validate').classList.add('valid');
            element.closest('.validate').classList.remove('invalid');
            errorMsgElement.innerText = '';
        }

        return messageError;
    }

    if( options.rules ){

        var customRules = [];
        options.rules.forEach( rule => {

            if(Array.isArray( customRules[rule.selector] )){
                customRules[rule.selector].push(rule.test);
            }else{
                customRules[rule.selector] = [rule.test];
            }
            
            var elements = form.querySelectorAll(rule.selector);
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
                    case 'slb':
                        element.onchange = function(){
                            validate(element, customRules[rule.selector], rule.error);
                        }
                        break;
                    case 'fi':
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
        return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    return {
        type: 'tb',
        selector: selector,
        test: function( element, form ){
            return checkEmail(element.value)  ? undefined : msg  || Validator.message.email;
        }
    };
}

Validator.tbRequired = function({selector, msg, error}) {
    return {
        type: 'tb',
        selector: selector,
        error: error,
        test: function( element, form ){
            return element.value.trim() ? undefined : msg || Validator.message.required;
        }
    };
}

Validator.file = function({selector, required, size, extension}) {
    Functions.displayNoteMessage(selector, extension, size);

    return {
        type: 'fi',
        selector: selector,
        test: function( element, form ){
            return Functions.checkfile({element, required, extension, size});
        }
    };
}

Validator.rbRequired = function({selector, msg, error}) {
    return {
        type: 'rb',
        selector: selector,
        error: error,
        test: function( element, form ){
            let rbElements = form.querySelectorAll(selector);
            let rbCheckFlag = false;
            rbElements.forEach( rbE => {
                if( rbE.checked == true )
                    rbCheckFlag = true;
            });

            return rbCheckFlag ? undefined : msg || Validator.message.required;
        }
    };
}

Validator.isPInt = function({selector, msg}) {
    return {
        type: 'tb',
        selector: selector,
        test: function( element, form ){
            return parseInt(element.value) > 0 || !element.value.trim() ? undefined : msg || 'The number must be greater than 0 / Số phải lớn hơn 0!';
        }
    };
}

Validator.cbChecked = function ({selector, msg, error}) {
    return {
        type: 'cb',
        selector: selector,
        error: error,
        test: function( element, form ){
            var cbs = element.querySelectorAll('input[type="checkbox"]');
            return Functions.cbChecked(cbs) ? undefined : msg || Validator.message.required;
        }
    };
}

Validator.slbRequired = function ({selector, msg}){
    return {
        type: 'slb',
        selector: selector,
        test: function( element, form ){
            return  element.value ? undefined : msg || Validator.message.required;
        }
    };
}

export { Validator };