Validator({
    form: '#frm-search',
    rules: [
        Validator.tbRequired({
            selector: '#key_search',
            submit: true
        })
    ],
    onSubmit: (data) => {
        data.form.submit();
    }
});