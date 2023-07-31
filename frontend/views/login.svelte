<script>
    import { onMount } from 'svelte';
    
    let createAccount = false;

    onMount(() => {
    });


    function submitLogin(e) {
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
                    window.location.href = 'https://kitchen.quasardilla.com';
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
                <p class="input-error">Please sign in with google!</p>
            </div>
            <div class="form-group">
                <input type="password" name="password" autocomplete="off" placeholder="Password"/>
            </div>
            <button class="form-button" type="submit"> Log In </button>
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
        </form>
    </div>
</main>

<style>
    .hidden {
        display: none;
    }
</style>