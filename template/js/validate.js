function Validator( options ) {
    var formElement = document.querySelector(options.form);

    formElement.onsubmit = function(e){
        e.preventDefault();
        var flagSubmit = true;
        var viewInvalidElement = null;
        options.rules.forEach( rule => {
           var inputElements = formElement.querySelectorAll(rule.inputSelector);
            inputElements.forEach( inputElement => {
                if( inputElement ){
                    var isFormValid = validate(inputElement, customRules[rule.inputSelector]);
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
            
            if(Array.isArray( customRules[rule.inputSelector] )){
                customRules[rule.inputSelector].push(rule.test);
            }else{
                customRules[rule.inputSelector] = [rule.test];
            }
            
            var inputElements = formElement.querySelectorAll(rule.inputSelector);

            inputElements.forEach( inputElement => {
                // console.log(inputElement);

                switch(rule.type) {
                    case 'cb':
                        var cbs = inputElement.querySelectorAll('input[type="checkbox"]');
                        cbs.forEach(cb => {
                            cb.addEventListener("click", function(){ 
                                validate(inputElement, customRules[rule.inputSelector]);
                            });
                        });
                      break;
                    default:
                        inputElement.onblur = function(){
                            validate(inputElement, customRules[rule.inputSelector]);
                        }
                }

            });

        });
    }
}

Validator.email = function( inputSelector ) {
    checkEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    return {
        type: 'tb',
        inputSelector: inputSelector,
        test: function( inputElement, formElement ){
            return checkEmail(inputElement.value) ? undefined : 'The e-mail address entered is invalid / Địa chỉ email không hợp lệ!';
        }
    };
}

Validator.tbRequired = function( inputSelector ) {
    return {
        type: 'tb',
        inputSelector: inputSelector,
        test: function( inputElement, formElement ){
            return inputElement.value.trim() ? undefined : 'This field is required / Vui lòng không để trống thông tin này!';
        }
    };
}

Validator.rbRequired = function( inputSelector ) {
    return {
        type: 'rb',
        inputSelector: inputSelector,
        test: function( inputElement, formElement ){
            let rbElements = formElement.querySelectorAll(inputSelector);
            let rbCheckFlag = false;
            rbElements.forEach( rbE => {
                if( rbE.checked == true )
                    rbCheckFlag = true;
            });

            return rbCheckFlag ? undefined : 'This field is required / Vui lòng không để trống thông tin này!';
        }
    };
}

Validator.isLessThan = function( inputSelector, compareSelector, message ) {
    return {
        type: 'tb',
        inputSelector: inputSelector,
        test: function( inputElement, formElement ){
            let compareValue = formElement.querySelector(compareSelector).value;
            return parseInt(inputElement.value) > parseInt(compareValue) || !inputElement.value.trim() || !compareValue ? undefined : message || 'The enter value is incorrect!';
        }
    };
}

Validator.isMoreThan = function( inputSelector, compareSelector, message ) {
    return {
        type: 'tb',
        inputSelector: inputSelector,
        test: function( inputElement, formElement ){
            let compareValue = formElement.querySelector(compareSelector).value;
            return parseInt(inputElement.value) < parseInt(compareValue) || !inputElement.value.trim() || !compareValue ? undefined : message || 'The enter value is incorrect!';
        }
    };
}

Validator.isPInt = function( inputSelector ) {
    return {
        type: 'tb',
        inputSelector: inputSelector,
        test: function( inputElement, formElement ){
            return parseInt(inputElement.value) > 0 || !inputElement.value.trim() ? undefined : 'The number must be greater than 0!';
        }
    };
}

Validator.cbChecked = function ( inputSelector ) {
    return {
        type: 'cb',
        inputSelector: inputSelector,
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
            return isCheckedbox(cbs) ? undefined : 'This field is required / Vui lòng không để trống thông tin này!';
        }
    };
}