<script>
    import { onMount } from 'svelte';
    
    let createAccount = false;

    onMount(async () => {       
        onLoad();
    })

    globalThis.googleButton = (data) => {
        console.log("google button was pressed")
        console.log(createAccount ? "register" : "login")

        if(createAccount)
            submitRegisterGoogle(data)
        else
            submitLoginGoogle(data)
    }



    function onLoad() {
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
    }

    function submitLogin() {
        let creds = {
            username: document.getElementById('login-form').elements.username.value,
            password: hashPassword(document.getElementById('login-form').elements.password.value)
        }

        fetch('https://kitchen.quasardilla.com/api/user-infos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(creds)
        }).then(response => {
            if (response.status == 200) {
                try {
                    redirect = new URLSearchParams(window.location.search).get('redirect')
                } catch (error) {
                    console.log(error);
                    window.location.href = 'https://kitchen.quasardilla.com/#/home';
                    return;
                }
                window.location.href = 'https://kitchen.quasardilla.com' + redirect;
            } else {
                document.getElementById('validation-message').innerHTML = 'Invalid username or password!';
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    function submitLoginGoogle(data) {
        fetch('https://kitchen.quasardilla.com/api/user-infos/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status == 200) {
                try {
                    redirect = new URLSearchParams(window.location.search).get('redirect')
                } catch (error) {
                    console.log(error);
                    window.location.href = 'https://kitchen.quasardilla.com/#/home';
                    return;
                }
                window.location.href = 'https://kitchen.quasardilla.com' + redirect;
            } else {
                document.getElementById('validation-message').innerHTML = 'Invalid username or password!';
            }
        })
    }

    function submitRegister(e) {
        let newUser = {
            email: document.getElementById('register-form').elements.email.value,
            username: document.getElementById('register-form').elements.username.value,
            password: document.getElementById('register-form').elements.password.value
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
            } else {
                document.getElementById('validation-message').innerHTML = 'Invalid username or password!';
            }
        })
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
            } else {
                document.getElementById('validation-message').innerHTML = 'Invalid username or password!';
            }
        })
    }

    function hashPassword(password) {
        return password;
    }

</script>

<main>
    <div id="form-container">
        <form class="form" id="login-form" class:hidden={createAccount} on:submit|preventDefault={submitLogin}>
            <h1 class="form-title">Login</h1>
            <p id="validation-message"></p>
            <div class="form-group">
                <input type="text" name="username" autocomplete="off" placeholder="Username"/>
            </div>
            <div class="form-group">
                <input type="password" name="password" autocomplete="off" placeholder="Password"/>
            </div>
            <button class="form-button" type="submit"> Log In </button>
            <div class="google-button">
                <!-- <div id="g_id_onload"
                    data-client_id="1031211223829-rcpnm0oir864p1odjhf0jkfbicirvs7v.apps.googleusercontent.com"
                    data-context="signin"
                    data-ux_mode="popup"
                    data-callback="googleButton"
                    data-auto_prompt="false">
                </div> -->
        
                <div id="g-signin">
                </div>
            </div>
            <a href="./">
                <p class="form-text">
                    Forgot your username/password?
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
                <p class="input-error">Please enter a valid email address!</p>
            </div>
            <div class="form-group">
                <input type="text" name="username" placeholder="Username"/>
                <p class="input-error">Usernames must consist of more than 4 and less than 20 characters.</p>
            </div>
            <div class="form-group">
                <input type="password" name="password" autocomplete="off" placeholder="Password"/>
                <p class="input-error">Passwords must contain uppercase, lowercase, special(!@#$%^&*) characters and a number</p>
            </div>
            <div class="form-group">
                <input type="password" name="conf-password" autocomplete="off" placeholder="Confirm Password"/>
                <p class="input-error">Passwords do not match!</p>
            </div>
            <button type="submit" class="form-button"> Sign Up </button>
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
        align-items: center;
        height: 80%;
        text-align: center;
    }
    
    #form-container form {
        border: 2px solid rgba(0, 0, 0, 0.2);
        padding: 2rem;
        width: 50rem;
    }

    .form-group input {
        font-family: AvenirLocal, Avenir, Helvetica, Arial, sans-serif;
        width: 100%;
        padding: 1rem;
        margin: 1rem 0;
        border: 2px solid rgba(0, 0, 0, 0.2);
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
        font-size: 1.5rem;
        background-color: #f5f5f5;
    }

    .form-button:hover {
        background-color: #e5e5e5;
        cursor: pointer;
    }

    .google-button {
        display: flex;
        justify-content: center;
        padding: 1rem 0 1rem 0;
    }
</style>