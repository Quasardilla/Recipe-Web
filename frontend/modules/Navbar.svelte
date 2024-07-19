<script>
    import { onMount } from 'svelte';
    import Icon from './Icon.svelte'

    let scripts = require('../sharedScripts.js');
    
    const KitchenIconDark = require('../assets/icons/KitchenFullTransparentWhite.svg');
    const KitchenIconLight = require('../assets/icons/KitchenFullTransparentBlack.svg');
    // const ProfileIcon = require('../assets/icons/Person.svg');
    // const ThemeIconDark = require('../assets/icons/Sun.svg');
    // const ThemeIconLight = require('../assets/icons/Moon.svg');
    
    let iconUrl = 'https://kitchen.quasardilla.com/';
    
    onMount(async () => {
        verifyTheme()
        
        scripts.requestWithToken('https://kitchen.quasardilla.com/api/tokens/', 'GET')
        .then((response) => {
            if(response.status == 200) {
                document.body.classList.add('logged-in');
                iconUrl = 'https://kitchen.quasardilla.com/#/home'
            }
            else {
                iconUrl = 'https://kitchen.quasardilla.com/';
            }
        })
    });

    function revealLogoutModel() {
        document.querySelector('.modal').style.display = 'block';
    }

    function hideLogoutModel() {
        document.querySelector('.modal').style.display = 'none';
    }

    async function logout() {
        await scripts.request('https://kitchen.quasardilla.com/api/user-infos/logout', 'POST')
        window.location.href = 'https://kitchen.quasardilla.com/';
    }

    function toggleTheme() {
        if (localStorage.getItem('darkmode') == 'true') {
            localStorage.setItem('darkmode', false);
            lightColors();
        } else {
            localStorage.setItem('darkmode', true);
            darkColors();
        }
    }

    function verifyTheme() {
        console.log('verifying theme')

        if (localStorage.getItem('darkmode') == 'true') {
            darkColors();
        }
        else {
            lightColors();
        }
    }

    function lightColors() {
        document.body.classList.add('light-theme');
        document.body.classList.remove("dark-theme");
        document.querySelector(':root').style.setProperty('--primary', '#fff')
        document.querySelector(':root').style.setProperty('--primary-dark', '#ddd')
        document.querySelector(':root').style.setProperty('--secondary', '#a7a7b5')
        document.querySelector(':root').style.setProperty('--secondary-dark', '#7f7f8a')
        document.querySelector(':root').style.setProperty('--tertiary', '#b16af0')
        document.querySelector(':root').style.setProperty('--tertiary-dark', '#63319e')
        document.querySelector(':root').style.setProperty('--text-color', '#000')
    }

    function darkColors() {
        document.body.classList.add('dark-theme');
        document.body.classList.remove("light-theme");
        document.querySelector(':root').style.setProperty('--primary', '#57585e')
        document.querySelector(':root').style.setProperty('--primary-dark', '#44454a')
        document.querySelector(':root').style.setProperty('--secondary', '#a7a7b5')
        document.querySelector(':root').style.setProperty('--secondary-dark', '#7f7f8a')
        document.querySelector(':root').style.setProperty('--tertiary', '#b16af0')
        document.querySelector(':root').style.setProperty('--tertiary-dark', '#63319e')
        document.querySelector(':root').style.setProperty('--text-color', '#fff')
    }
</script>

<main>
    <nav id="navBar">
        <div id="logo">
            <a href={iconUrl}>
                <img alt="main-icon" class="dark-icon" src={KitchenIconDark}/>
                <img alt="main-icon" class="light-icon" src={KitchenIconLight}/>
            </a>
        </div>
        <div id="search">
            <img id="search-icon" alt="search-icon"/>
            <button id="search-bar-mini"></button>
        </div>
        <div id="right-aligned-content">
            <button class="nav-button" id="theme-toggle" on:click={toggleTheme}>
                <!-- <img alt="theme-icon" class="dark-icon" src={ThemeIconDark}>
                <img alt="theme-icon" class="light-icon" src={ThemeIconLight}> -->
                <Icon class="light-icon" name='sun'/>
                <Icon class="dark-icon" name='moon'/>
            </button>
            <div id="profile-content">
                <button class="nav-button" id="profile">
                    <Icon name='person'/>
                </button>
                <div id="profile-dropdown">
                    <div class="logged-out-item">
                        <h3>Log in or create an account</h3>
                        <a href="/#/auth/user/login">
                            <button id="login-button">Log in</button>
                        </a>

                        <hr class="hl-dropdown">
                    </div>

                    <button id="profile-dropdown-button">Profile</button>
                    <button id="profile-dropdown-button">Settings</button>
                    <button id="profile-dropdown-button" on:click={revealLogoutModel}>Logout</button>
                </div>
            </div>
        </div>
    </nav>

    <div style="min-height: 7rem"></div>

    <div class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Log Out</h2>
            </div>
            <div class="modal-body">
                <p>Are You sure you want to log out?</p>
                <div>
                    <button on:click={logout}>Log Out</button>
                    <button on:click={hideLogoutModel}>Cancel</button>
                </div>
            </div>
            <div class="modal-footer">
                <h3>Modal Footer</h3>           
            </div>
        </div>
    </div>
</main>

<style>
    #navBar {
        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;
        
        height: 7rem;
        background-color: var(--primary-dark);
        padding: 0 2rem 0 2rem;
        align-items: center;
        display: flex;
        justify-content: space-between;
        position: fixed;
        z-index: 100;
    }

    .nav-button {
        width: 5rem;
        height: 5rem;
        border-radius: 1rem;
        border: 0.2rem solid var(--secondary-dark);
        background-color: var(--primary-dark);
        margin: 0 1rem 0 1rem;
    }

    .nav-button:hover {
        cursor: pointer;
    }

    .nav-button :global(svg) {
        width: 100%;
        height: auto;
    }

    #right-aligned-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    #profile-content #profile-dropdown {
        position: absolute;
        width: 15rem;
        background-color: var(--primary-dark);
        border-radius: 1rem;
        border: 0.2rem solid var(--secondary-dark);
        display: none;
        flex-direction: column;
        transition: all 0.2s ease-in-out;
        overflow: hidden;
    }
    

    #profile-content:hover #profile-dropdown, #profile-content:active #profile-dropdown {
        display: flex;
        border-top-right-radius: 0;
        top: 6rem;
        right: 3rem;
    }

    #profile-dropdown h3 {
        color: var(--text-color);
        background-color: var(--primary);
        text-align: center;
        margin: 0;
        padding-top: 0.5rem;
    }

    #profile-dropdown button {
        text-align: center;
        font-size: 2rem;
        width: 100%;
        cursor: pointer;
        border: none;
        color: var(--text-color);
        background-color: var(--primary);
        font-family: var(--font-family);
    }

    #profile-dropdown #login-button {
        background-color: var(--tertiary);
        color: var(--text-color);
        font-size: 2rem;
        border: none;
        border-radius: 0.5rem;
        width: -webkit-fill-available;
        width: -moz-available;
        padding: 0.5rem 0.25rem 0.5rem 0.25rem;
        margin: 1rem 0.5rem 1rem 0.5rem;
        font-family: var(--font-family);
        transition: ease-in-out 200ms;
    }

    #profile-dropdown #login-button:hover {
        background-color: var(--tertiary-dark);
    }

    #profile-dropdown button:hover {
        background-color: var(--primary-dark);
    }

    #profile-content:hover #profile, #profile-content:active #profile {
        border-bottom: none;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        cursor: pointer;
    }

    .hl-dropdown {
        width: 100%;
        border-color: var(--text-color);
        margin: 0;
    }

    #logo img {
        height: 100%;
        width: auto;
    }

    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        padding-top: 100px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .modal-content {
        background-color: var(--primary-dark);
        margin: auto;
        padding: 20px;
        border: 1px solid var(--secondary-dark);
        width: 80%;
    }
</style>