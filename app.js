function Validator(options){
    var selectorRules = {}
    function Validate(inputElement,rule){
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        //lay ra cac rule cua selector
        var rules = selectorRules[rule.selector];
        // lap qua tung rule va kiem tra
        // Neu co loi thi dung viec kiem tra
        for (var i = 0; i < rules.length;i++){
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break;
        }

                if (errorMessage){
                    errorElement.innerText = errorMessage
                    inputElement.parentElement.classList.add('invalid')
                } else {
                    errorElement.innerText = ""
                    inputElement.parentElement.classList.remove('invalid')
                }
                return !errorMessage
    }
    var formElement = document.querySelector(options.form)
    if (formElement) {
        // khi submit form
        formElement.onsubmit = function(e){
            e.preventDefault()
            var isFromValid = true;   
            options.rules.forEach((rule)=>{
                // lap qua tung rule va validate
                var inputElement = formElement.querySelector(rule.selector);
                var isValid =Validate(inputElement,rule)
                if(!isValid){
                    isFromValid = false;
                }
            });
            if (isFromValid){
                // truong hop submit voi javascript
                if (typeof options.onSubmit ==="function"){
                    var enableInput = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInput).reduce((values,input)=>{
                        return (values[input.name] = input.value) && values
                        },{});

                    options.onSubmit(formValues)
                }
            }
            // truong hop submit voi hanh vi mac dinh
            // else{
            //    formElement.submit();
            // }

        }
        // lặp qua mỗi rule và xử lý(lắng nghe sự kiện blur,input)
        options.rules.forEach((rule)=>{
        if (Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test)
        }else{
            selectorRules[rule.selector] = [rule.test];
        }
        // Lưu lại các rule cho mối object
     
        var inputElement = formElement.querySelector(rule.selector);

        if (inputElement) {
            // xu ly truong hop blur khoi input
            inputElement.onblur = () =>{
                Validate(inputElement,rule)
            };
            inputElement.oninput = () => {
                var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                errorElement.innerText = ""
                inputElement.parentElement.classList.remove('invalid')
            }
        }
        });
    }
}

// nguyen tac cua cac rule
// 1. khi co loi => tra ra message loi
// 2. khi hop le => k tra ra cai gi ca
Validator.isName = function(selector,message){
    return {
        selector: selector,
        test: function(value){
            var regex =/^[A-Za-zÀ-ỹ\s]+$/;
            return regex.test(value.trim()) ? undefined: "Tên này chỉ được chứa chữ cái và khoảng trắng."
        }
    }
}
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined: "Vui lòng nhập trường này."
        }
    }
}
Validator.isEmail = function(selector, message){
     return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined: "Trường này phải là email."
        }
    }
}
Validator.minLength = function(selector, min, message){
     return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined: `Vui lòng nhập tối thiểu ${min} kí tự.`;
        }
    }
}
Validator.isConfirm = function(selector, getConfirmValue, message){
     return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined: 'Giá trị nhập vào không chính xác.';
        }
    }
}