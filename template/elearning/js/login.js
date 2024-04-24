import { Validator } from "./function.js";
import sheet from '../css/style.css' assert { type: 'css' };
document.adoptedStyleSheets = [sheet];

Validator({
    form: '#modal__login-form',
    rules: [
        Validator.tbRequired({
            selector : '#form__tb--username', 
            msg : Validator.message.required
        }),
        Validator.tbRequired({
            selector : '#form__tb--password', 
            msg : Validator.message.required
        })
    ],
    onSubmit: (data) => {
        document.getElementById("modal__login").style.display = "none";
        document.getElementById("modal__loading").style.display = "flex";
    }
});

function render(){
    let rootElement = document.getElementById('root');

    let headings = [1, 2, 3, 4];

    headings.forEach( index => {
        let h1 = document.createElement('h1');
        h1.classList.add('heading-hello');
        h1.innerText = 'Hello world ' + index;
        rootElement.appendChild(h1);
    });
}

render();