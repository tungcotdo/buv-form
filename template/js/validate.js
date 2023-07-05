function Validator( options ) {
    var formElement = document.querySelector(options.form);

    formElement.onsubmit = function(e){
        e.preventDefault();
        var flagSubmit = true;
        var viewInvalidElement = null;
        options.rules.forEach( rule => {
           var inputElements = formElement.querySelectorAll(rule.selector);
            inputElements.forEach( inputElement => {
                if( inputElement ){
                    var isFormValid = validate(inputElement, customRules[rule.selector]);
                    if( isFormValid !== undefined ){
                        flagSubmit = false;
                        viewInvalidElement = inputElement;
                    }
                }
            });
        });

        if( flagSubmit ){
            var responses = {};
            var datas = formElement.querySelectorAll('input[name]');
            datas.forEach( data => {
                responses[data.name] = data.value;
            });
            options.onSubmit(responses);
            formElement.submit();
        }else{
            viewInvalidElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }

    function validate(inputElement, rule){
        var errorMessage;
        for( var i = 0; i < rule.length; i++ ){
            errorMessage = rule[i](inputElement, formElement);
            if( errorMessage !== undefined ) break;
        }

        var errorElement = inputElement.closest('.validate').querySelector(".error-message");
        if( errorMessage ) {
            errorElement.innerText = errorMessage;
            inputElement.closest('.validate').classList.remove('valid');
            inputElement.closest('.validate').classList.add('invalid');
        }else{
            errorElement.innerText = '';
            inputElement.closest('.validate').classList.remove('invalid');
            inputElement.closest('.validate').classList.add('valid');
        }

        return errorMessage;
    }

    if( options.rules ){

        var customRules = [];
        options.rules.forEach( rule => {
            if(Array.isArray( customRules[rule.selector] )){
                customRules[rule.selector].push(rule.test);
            }else{
                customRules[rule.selector] = [rule.test];
            }
            
            var inputElements = formElement.querySelectorAll(rule.selector);
            inputElements.forEach( inputElement => {
                // console.log(rule.type);

                switch(rule.type) {
                    case 'cb':
                        var cbs = inputElement.querySelectorAll('input[type="checkbox"]');
                        cbs.forEach(cb => {
                            cb.addEventListener("click", function(){ 
                                validate(inputElement, customRules[rule.selector]);
                            });
                        });
                      break;
                    case 'bd':
                        var slbs = inputElement.querySelectorAll('select');
                        slbs.forEach(slb => {
                            slb.addEventListener("change", function(){ 
                                validate(inputElement, customRules[rule.selector]);
                            });
                        });
                      break;
                    default:
                        inputElement.onblur = function(){
                            validate(inputElement, customRules[rule.selector]);
                        }
                }

            });

        });
    }
}

Validator.email = function({selector, errMsg}) {
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
        test: function( inputElement, formElement ){
            return checkEmail(inputElement.value) 
                    ? undefined 
                    : errMsg  || 'The e-mail address entered is invalid / Địa chỉ email không hợp lệ!';
        }
    };
}

Validator.tbRequired = function({selector, errMsg}) {
    return {
        type: 'tb',
        selector: selector,
        test: function( inputElement, formElement ){
            return inputElement.value.trim() 
                    ? undefined 
                    : errMsg  || 'This field is required / Vui lòng không để trống thông tin này!';
        }
    };
}

Validator.rbRequired = function({selector, errMsg}) {
    return {
        type: 'rb',
        selector: selector,
        test: function( inputElement, formElement ){
            let rbElements = formElement.querySelectorAll(selector);
            let rbCheckFlag = false;
            rbElements.forEach( rbE => {
                if( rbE.checked == true )
                    rbCheckFlag = true;
            });

            return rbCheckFlag 
                    ? undefined 
                    : errMsg  || 'This field is required / Vui lòng không để trống thông tin này!';
        }
    };
}

Validator.isPInt = function({selector, errMsg}) {
    return {
        type: 'tb',
        selector: selector,
        test: function( inputElement, formElement ){

            return parseInt(inputElement.value) > 0 || !inputElement.value.trim() 
                    ? undefined 
                    : errMsg || 'The number must be greater than 0!';
        }
    };
}

Validator.cbChecked = function ({selector, errMsg}) {
    return {
        type: 'cb',
        selector: selector,
        test: function( inputElement, formElement ){
            
            function isCheckedbox(cbs){
                var checkedFlag = false;
                cbs.forEach(cb => {
                    if (cb.checked) {
                        checkedFlag = true;
                    }
                });
                return checkedFlag;
            }

            var cbs = inputElement.querySelectorAll('input[type="checkbox"]');

            return isCheckedbox(cbs) 
                    ? undefined 
                    : errMsg || 'This field is required / Vui lòng không để trống thông tin này!';
        }
    };
}

Validator.bdRequired = function ({selector, errMsg}){
    return {
        type: 'bd',
        selector: selector,
        test: function( inputElement, formElement ){
            
            function isSelected(slbs){
                var checkedFlag = true;
                slbs.forEach(sl => {
                    if ( sl.value == null || sl.value == '' || sl.value == undefined ) {
                        checkedFlag = false;
                    }
                });
                return checkedFlag;
            }

            var slbs = inputElement.querySelectorAll('select');
            return isSelected(slbs) 
                    ? undefined 
                    : errMsg || 'This field is required / Vui lòng nhập đầy đủ ngày/tháng/năm!';
        }
    };
}