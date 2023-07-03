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
            errorMessage = rule[i](inputElement.value, formElement);
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
                if( inputElement ){
                    inputElement.onblur = function(){
                        validate(inputElement, customRules[rule.inputSelector]);
                    }
                }
            });

        });
    }
}

Validator.isEmail = function( inputSelector ) {
    checkEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    return {
        inputSelector: inputSelector,
        test: function( value, formElement ){
            return checkEmail(value) ? undefined : 'The e-mail address entered is invalid / Địa chỉ email không hợp lệ!';
        }
    };
}

Validator.isTBRequired = function( inputSelector ) {
    return {
        inputSelector: inputSelector,
        test: function( value, formElement ){
            return value.trim() ? undefined : 'This field is required / Vui lòng không để trống thông tin này!';
        }
    };
}

Validator.isRBRequired = function( inputSelector ) {
    return {
        inputSelector: inputSelector,
        test: function( value, formElement ){
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

Validator.isCBRequired = function( inputSelector ) {
    return {
        inputSelector: inputSelector,
        test: function( value, formElement ){
            return formElement.querySelector(inputSelector).checked ? undefined : 'This field is required / Vui lòng không để trống thông tin này!';
        }
    };
}

Validator.isLessThan = function( inputSelector, compareSelector, message ) {
    return {
        inputSelector: inputSelector,
        test: function( value, formElement ){
            let compareValue = formElement.querySelector(compareSelector).value;
            return parseInt(value) > parseInt(compareValue) || !value.trim() || !compareValue ? undefined : message || 'The enter value is incorrect!';
        }
    };
}

Validator.isMoreThan = function( inputSelector, compareSelector, message ) {
    return {
        inputSelector: inputSelector,
        test: function( value, formElement ){
            let compareValue = formElement.querySelector(compareSelector).value;
            return parseInt(value) < parseInt(compareValue) || !value.trim() || !compareValue ? undefined : message || 'The enter value is incorrect!';
        }
    };
}

Validator.isPInt = function( inputSelector ) {
    return {
        inputSelector: inputSelector,
        test: function( value, formElement ){
            return parseInt(value) > 0 || !value.trim() ? undefined : 'The number must be greater than 0!';
        }
    };
}