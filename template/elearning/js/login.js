import * as CSS from "./stylessheet.js";
import { Validator } from "./validator.js";
import { setTitle } from "./head.js";
import * as dasboard from "./dashboard.js";

setTitle('Login Page');

async function htmlRender(){
    let h = '<div class="modal modal__login" id="modal__login" style="display: flex;">';
            h += '<div class="modal__overlay"></div>';
            h += '<div class="modal__content modal__content--login">';
                h += '<img class="modal__login-logo" src="img/tungbinhthaison-thuphap.png" alt="tungbinhthaison-thuphap.png">';
                h += '<form class="modal__login-form" id="modal__login-form" action="">';
                    h += '<div class="form__group validate">';
                        h += '<input class="form__tb" id="form__tb--username" type="text" placeholder="Tài khoản">';
                        h += '<small class="message__error"></small>';
                    h += '</div>';
                    h += '<div class="form__group validate">';
                        h += '<input class="form__tb" id="form__tb--password" type="text" placeholder="Mật khẩu">';
                        h += '<small class="message__error"></small>';
                    h += '</div>';
                    h += '<input class="form__tb form__tb--submit" type="submit" value="Đăng nhập">';
                h += '</form>';
            h += '</div>';
        h += '</div>';

    document.getElementById('root').innerHTML = h;
}

htmlRender().then(
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
            document.getElementById("modal__loading").style.display = "flex";
            window.history.pushState('dasboard', 'Title', '/dasboard');
        }
    })
);


