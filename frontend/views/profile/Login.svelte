<script>
    import Icon from '../../modules/Icon.svelte'
    import { onMount } from 'svelte';
    let scripts = require('../../sharedScripts.js')
    // import Cancel from '../assets/icons/Cancel.svg';
    // import CancelDark from '../assets/icons/CancelDark.svg';
    // import Check from '../assets/icons/Check.svg';
    // import CheckDark from '../assets/icons/CheckDark.svg';

    let createAccount = false;

    let charLength = false;
    let charUpper = false;
    let charLower = false;
    let charSpecial = false;
    let charNumber = false;

    onMount(async () => {       
        google.accounts.id.initialize({
        client_id: '1031211223829-rcpnm0oir864p1odjhf0jkfbicirvs7v.apps.googleusercontent.com',
        callback: googleButton,
        });
        google.accounts.id.renderButton(document.getElementById('g-signin'), {
            type: 'standard',
            theme: 'filled_blue',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
        })
        google.accounts.id.renderButton(document.getElementById('g-signup'), {
            type: 'standard',
            theme: 'filled_blue',
            size: 'large',
            text: 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'left',
        })
    })

    globalThis.googleButton = (data) => {
        if(createAccount)
            submitRegisterGoogle(data)
        else
            submitLoginGoogle(data)
    }

    function submitLogin() {
        localStorage.setItem('refreshingToken', 'false');

        let creds = {
            email: document.getElementById('login-form').elements.email.value,
            password: document.getElementById('login-form').elements.password.value
        }

        fetch('https://kitchen.quasardilla.com/api/user-infos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(creds)
        }).then(response => {
            if (response.status == 200) {
                let redirect;
                let hash = window.location.hash;
                let params = new URLSearchParams(hash.substring(hash.indexOf('?')));
                try {
                    redirect = params.get('redirect')
                } catch (error) {
                    console.log(error)
                    window.location.href = 'https://kitchen.quasardilla.com/#/home';
                    return;
                }
                if (redirect == null || redirect == undefined || redirect == '') {
                    redirect = '#/home';
                }
                document.body.classList.add('logged-in');
                window.location.href = 'https://kitchen.quasardilla.com/' + redirect;
            } else {
                document.getElementById('validation-message').innerHTML = 'Invalid username or password!';
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    function submitLoginGoogle(data) {
        localStorage.setItem('refreshingToken', 'false');

        fetch('https://kitchen.quasardilla.com/api/user-infos/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status == 200) {
                let redirect;
                let hash = window.location.hash;
                let params = new URLSearchParams(hash.substring(hash.indexOf('?')));
                try {
                    redirect = params.get('redirect')
                } catch (error) {
                    console.log(error)
                    window.location.href = 'https://kitchen.quasardilla.com/#/home';
                    return;
                }

                if (redirect == null || redirect == undefined || redirect == '') {
                    redirect = '#/home';
                }

                window.location.href = 'https://kitchen.quasardilla.com/' + redirect;
            } else {
                document.getElementById('validation-message').innerHTML = 'Invalid username or password!';
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    async function submitRegister(e) {
        if(!validateEmail() || !validateUsername() || !validatePassword() || !checkPasswords()) {
            return;
        }

        let email = document.getElementById('register-form').elements.email.value
        let username = document.getElementById('register-form').elements.username.value
        let password = document.getElementById('register-form').elements.password.value

        username = await scripts.sanitizeRecipeData(username)

        let newUser = {
            email: email,
            username: username,
            password: password
        }

        fetch('https://kitchen.quasardilla.com/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        }).then(response => {
            if (response.status == 200) {
                createAccount = false;
                document.getElementById('login-form').elements.email.value = document.getElementById('register-form').elements.email.value
                document.getElementById('login-form').elements.password.value = document.getElementById('register-form').elements.password.value
                submitLogin();
            } else {
                document.getElementById('reg-email-err').innerHTML = 'Email is already in use!';
            }
        })
    }

    function validateEmail() {
        let form = document.getElementById('register-form')
        let email = form.elements.email;

        if(!email.checkValidity()) {
            document.getElementById('reg-email-err').innerHTML = 'Please enter a valid email address!';
            console.log('email isnt valid')
            return false;
        }

        document.getElementById('reg-email-err').innerHTML = '';
        return true;
    }

    function validateUsername() {
        let form = document.getElementById('register-form')
        let username = form.elements.username.value;

        if(username.length < 4 || username.length > 20) {
            document.getElementById('reg-user-err').innerHTML = 'Username must be 4 - 20 characters long!';
            return false;
        }
        
        if(!username.match(/^[a-zA-Z0-9]+$/)) {
            document.getElementById('reg-user-err').innerHTML = 'Username must only contain letters and numbers!';
            return false;
        }
        
        document.getElementById('reg-user-err').innerHTML = '';
        return true;

    }

    // Atleast 8 characters long, 1 capital character, 1 lowercase character,  1 number, 1 special character
    function validatePassword() {
        let form = document.getElementById('register-form')
        let password = form.elements.password.value;

        password.length < 8 ? charLength = false : charLength = true;
        !password.match(/[a-z]/g) ? charLower = false : charLower = true;
        !password.match(/[A-Z]/g) ? charUpper = false : charUpper = true;
        !password.match(/\d/g) ? charNumber = false : charNumber = true;
        !password.match(/\W/g) ? charSpecial = false : charSpecial = true;

        console.log(charLength, charLower, charUpper, charNumber, charSpecial)

        if(charLength && charLower && charUpper && charNumber && charSpecial) {
            return true;
        }
    }

    function checkPasswords() {
        let form = document.getElementById('register-form')
        let password = form.elements.password.value;
        let passwordConf = form.elements.confpassword.value;

        if(password == passwordConf) {
            document.getElementById('reg-pass-conf-err').innerHTML = '';
            return true;
        }

        document.getElementById('reg-pass-conf-err').innerHTML = 'Passwords do not match!';
        return false;

    }

    function submitRegisterGoogle(data) {
        fetch('https://kitchen.quasardilla.com/api/users/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status == 200) {
                createAccount = false;
                submitLoginGoogle(data);
            } else {
                document.getElementById('validation-message').innerHTML = 'Invalid username or password!';
            }
        })
    }

</script>

<main>
    <div id="form-container">
        <form class="form" id="login-form" class:hidden={createAccount} on:submit|preventDefault={submitLogin}>
            <h1 class="form-title">Login</h1>
            <p id="validation-message"></p>
            <div class="form-group">
                <input type="text" name="email" autocomplete="off" placeholder="Email"/>
            </div>
            <div class="form-group">
                <input type="password" name="password" autocomplete="off" placeholder="Password"/>
            </div>
            <button class="form-button primary-button" type="submit"> Log In </button>
            <div class="google-button">
                <div id="g-signin"></div>
            </div>
            <a href="./">
                <p class="form-text">
                    Forgot your password?
                </p>
            </a>
            <a href="./" on:click|preventDefault={() => {createAccount = true}}>
                <p class="form-text">
                    Register Account
                </p>
            </a>
        </form>
            

        <form class="form" id="register-form" class:hidden={!createAccount} on:submit|preventDefault={submitRegister}>
            <button type="button" class="form-button" on:click={() => {createAccount = false}}> Back to login </button>
            <h1 class="form-title">Register</h1>
            <div class="form-group">
                <input type="email" name="email" placeholder="Email"/>
                <p class="input-error" id="reg-email-err"></p>
            </div>
            <div class="form-group">
                <input type="text" name="username" placeholder="Username" on:input={validateUsername}/>
                <p class="input-error" id="reg-user-err"></p>
            </div>
            <div class="form-group">
                <input type="password" name="password" autocomplete="off" placeholder="Password" on:input={validatePassword}/>
                <p class="input-error" id="reg-pass-err"></p>

                <div id="password-checklist">
                    <p><Icon name={charLength ? 'check' : 'cancel'} class="icon-inline"/>At least 8 characters long</p>
                    <p><Icon name={charUpper ? 'check' : 'cancel'} class="icon-inline"/>At least 1 upper-case letter</p>
                    <p><Icon name={charLower ? 'check' : 'cancel'} class="icon-inline"/>At least 1 lower-case letter</p>
                    <p><Icon name={charNumber ? 'check' : 'cancel'} class="icon-inline"/>At least 1 number</p>
                    <p><Icon name={charSpecial ? 'check' : 'cancel'} class="icon-inline"/>At least 1 special character</p>
                </div>
            </div>
            <div class="form-group">
                <input type="password" name="confpassword" autocomplete="off" placeholder="Confirm Password"/>
                <p class="input-error" id="reg-pass-conf-err"></p>
            </div>
            <button type="submit" class="form-button"> Sign Up </button>

            <p> or </p>

            <div class="google-button">
                <div id="g-signup">
                </div>
            </div>
        </form>
    </div>
</main>

<style>
    .hidden {
        display: none;
    }

    #form-container {
        display: flex;
        justify-content: center;
        padding: 13rem 5rem 2rem 5rem;
        text-align: center;
    }
    
    #form-container form {
        background-color: var(--primary);
        border: 2px solid var(--secondary-dark);
        border-radius: 1rem;
        padding: 2rem;
        width: 40rem;
    }

    #form-container form .form-title {
        color: var(--text-color);
    }

    #form-container form a {
        color: var(--text-color);
        text-decoration-color: var(--text-color);
    }

    /* #form-container form a .form-text {
        color: var(--text-color);
        text-decoration-color: var(--text-color);
    } */

    .form-group input {
        font-family: AvenirLocal, Avenir, Helvetica, Arial, sans-serif;
        width: 100%;
        padding: 1rem;
        margin: 1rem 0;
        border: 2px solid var(--secondary-dark);
        font-size: 1.5rem;
    }

    .form-group .input-error {
        color: red;
        font-size: 1.4rem;
        margin: 0;
    }

    .form-button {
        font-family: AvenirLocal, Avenir, Helvetica, Arial, sans-serif;
        width: 100%;
        padding: 1rem;
        margin: 1rem 0;
        border: 2px solid rgba(0, 0, 0, 0.2);
        font-size: 2rem;
        border-color: var(--secondary-dark);
        transition: ease-in-out 200ms;
    }

    .form-button:hover {
        background-color: var(--tertiary-dark);
        cursor: pointer;
    }

    .google-button {
        display: flex;
        justify-content: center;
        padding: 1rem 0 1rem 0;
    }

    #password-checklist {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 0;
        padding: 0;
        color: var(--text-color);
    }

    #password-checklist p {
        margin: 0.5rem 0;
    }

    #password-checklist :global(.icon) {
        height: 3rem;
        margin-right: 1rem;
        width: auto;
        vertical-align: middle;
    }

    :global(.light-theme) #password-checklist :global(.check) {
        fill: var(--tertiary-dark);
    }

    :global(.dark-theme) #password-checklist :global(.check) {
        fill: var(--tertiary);
    }
</style>