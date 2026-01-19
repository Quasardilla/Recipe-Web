<script>
    import { onMount } from 'svelte';
    import Icon from './Icon.svelte'
    let scripts = require('../sharedScripts.js');
    const KitchenIconDark = require('../assets/icons/KitchenFullTransparentWhite.svg');
    const KitchenIconLight = require('../assets/icons/KitchenFullTransparentBlack.svg');
    const KitchenIconMini = require('../assets/icons/KitchenIconTransparent.svg');
    
    let iconUrl = 'https://kitchen.quasardilla.com/';
    let isMobile = mediaQueryMobile();
    let isMobileSearch = mediaQueryMobileSearch();

    
    onMount(async () => {
        verifyTheme()
        localStorage.setItem('refreshingToken', 'false')
        
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

        window.addEventListener("resize", function() {
            if(mediaQueryMobile()) {
                isMobile = true;
            }
            else {
                isMobile = false;
            }

            if(mediaQueryMobileSearch()) {
                this.document.getElementById('search').style.display = 'none';
                this.document.getElementById('mobile-search').style.display = 'flex';
            } else {
                this.document.getElementById('search').style.display = 'flex';
                this.document.getElementById('mobile-search').style.display = 'none';
            }
        });
    });

    function mediaQueryMobile() {
        return window.matchMedia('(max-width: 700px)').matches;
    }

    function mediaQueryMobileSearch() {
        return window.matchMedia('(max-width: 500px)').matches;
    }

    function revealLogoutModel() {
        document.getElementById('logout-modal').style.display = 'initial';
        document.getElementById('search-modal').style.display = 'none';
    }

    function hideLogoutModel() {
        document.getElementById('logout-modal').style.display = 'none';
    }

    function revealSearchModel() {
        document.getElementById('search-modal').style.display = 'initial';
        document.getElementById('logout-modal').style.display = 'none';

        document.getElementById('search-tags').focus();
    }

    function hideSearchModel() {
        document.getElementById('search-modal').style.display = 'none';
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
        document.querySelector(':root').style.setProperty('--secondary', '#bdbdc7')
        document.querySelector(':root').style.setProperty('--secondary-dark', '#acacb9')
        document.querySelector(':root').style.setProperty('--tertiary', '#622aac')
        document.querySelector(':root').style.setProperty('--tertiary-dark', '#63319e')
        document.querySelector(':root').style.setProperty('--text-color', '#000')
        document.querySelector(':root').style.setProperty('--text-color-dark', '#4e4d56')
    }

    function darkColors() {
        document.body.classList.add('dark-theme');
        document.body.classList.remove("light-theme");
        document.querySelector(':root').style.setProperty('--primary', '#57585e')
        document.querySelector(':root').style.setProperty('--primary-dark', '#44454a')
        document.querySelector(':root').style.setProperty('--secondary', '#6b6b80')
        document.querySelector(':root').style.setProperty('--secondary-dark', '#7f7f8a')
        document.querySelector(':root').style.setProperty('--tertiary', '#622aac')
        document.querySelector(':root').style.setProperty('--tertiary-dark', '#63319e')
        document.querySelector(':root').style.setProperty('--text-color', '#fff')
        document.querySelector(':root').style.setProperty('--text-color-dark', '#bbbcc3')
    }
</script>

<main>
    <div class="flex-column nav-container">
        <nav id="navBar">
            <div id="logo">
                <a href={iconUrl}>
                    {#if isMobile}
                        <img alt="main-icon" src={KitchenIconMini}/>
                    {:else}
                        <img alt="main-icon" class="dark-icon" src={KitchenIconDark}/>
                        <img alt="main-icon" class="light-icon" src={KitchenIconLight}/>
                    {/if}
                </a>
            </div>
            <label id="search" class="flex-row flex-center" style="display: {isMobileSearch ? 'none' : 'flex'};">
                <Icon name='search'/>
                <input id="search-bar-mini" placeholder="search" on:click={revealSearchModel} aria-readonly="true" readOnly="true" readonly="true"/>
            </label>
            <div id="right-aligned-content">
                <button class="nav-button" id="theme-toggle" on:click={toggleTheme}>
                    <!-- <img alt="theme-icon" class="dark-icon" src={ThemeIconDark}>
                    <img alt="theme-icon" class="light-icon" src={ThemeIconLight}> -->
                    <Icon class="light-icon" name='sun'/>
                    <Icon class="dark-icon" name='moon'/>
                </button>
                <div id="profile-content">
                    <button class="nav-button" id="profile" on:click={(event) => {console.log(event)}}>
                        <Icon name='person'/>
                    </button>
                    <div id="profile-dropdown" tabindex="-1">
                        <div class="logged-out-item">
                            <h3>Log in or create an account</h3>
                            <a href="/#/auth/user/login">
                                <button id="login-button">Log in</button>
                            </a>
    
                            <hr class="hl-dropdown">
                        </div>
                        <div class="logged-in-item">
                            <button class="profile-dropdown-button">Profile</button>
                            <button class="profile-dropdown-button">Settings</button>
                            <button class="profile-dropdown-button" on:click={revealLogoutModel}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
    
        </nav>
    
        <div id="mobile-search-container" style="display: {!isMobileSearch ? 'none' : 'flex'};">
            <label id="mobile-search" class="flex-row flex-center">
                <Icon name='search'/>
                <input id="search-bar-mini" placeholder="search" on:click={revealSearchModel} aria-readonly="true" readOnly="true" readonly="true"/>
            </label>
        </div>
    </div>

    <div style="min-height: {isMobileSearch ? '15rem' : '9rem'}"></div>

    <div class="modal" id="logout-modal" on:click|self={hideLogoutModel} on:keydown={null} role="dialog" aria-modal="true" tabindex="-1">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Log Out</h2>
            </div>
            <div class="modal-body">
                <p>Are You sure you want to log out?</p>
                <div class="flex-row flex-center">
                    <button on:click={logout}>Log Out</button>
                    <button on:click={hideLogoutModel}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" id="search-modal" on:click|self={hideSearchModel} on:keydown={null} role="dialog" aria-modal="true" tabindex="-1">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Search Recipes</h2>
            </div>
            <div class="modal-body">
                <label id="modal-search" class="flex-row flex-center">
                    <Icon name='search'/>
                    <input id="search-tags" placeholder="search" autocomplete="off" on:input={(event) => {scripts.refreshTagAutoComplete(event, 'tag-search-suggestions')}}/>
                </label>
                <div id="tag-search-suggestions"></div>

                <div>
                    <button on:click={hideSearchModel}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .nav-container {
        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;

        display: flex;
        flex-direction: column;

        background-color: var(--primary-dark);
        position: fixed;
        z-index: 100;
        padding: 1rem 0
    }

    #navBar {
        height: 7rem;

        padding: 0 2rem 0 2rem;
        align-items: center;
        display: flex;
        justify-content: space-between;
    }

    .nav-button {
        width: 5rem;
        height: 100%;
        background-color: var(--primary-dark);
        margin: 0 1rem 0 1rem;
        padding: none;
        border: none;
    }

    .nav-button:hover {
        cursor: pointer;
    }

    .nav-button :global(svg) {
        width: 100%;
        height: auto;
        padding: 0.5rem;
        border-radius: 1rem;
        border: 0.2rem solid var(--secondary-dark);
    }

    #search, #mobile-search, #modal-search {
        border: 0.2rem solid var(--secondary);
        border-radius: 2rem;
    }

    #search {
        max-width: 40rem;
        width: 30vw;
        margin-left: -5vw;
    }

    #modal-search {
        max-width: 40rem;
        width: 100%;
        margin: 0 auto 3rem auto;
    }

    #mobile-search-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }

    #mobile-search {
        width: 70vw;
        background-color: var(--primary-dark);
        padding: 0 2rem 0 2rem;
        height: 4rem;
        align-items: center;
        display: flex;
        justify-content: center;
        z-index: 50;
    }

    :global(#search .icon, #mobile-search .icon, #modal-search .icon) {
        min-width: 3rem;
        width: 3rem;
        height: auto;
        padding: 0.5rem;
    }

    #search input, #mobile-search input, #modal-search input {
        background-color: transparent;
        border: none;
        width: 100%;
    }

    #search input:focus, #mobile-search input:focus, #modal-search input:focus {
        outline: none;
    }

    #right-aligned-content {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    #profile-content #profile-dropdown {
        position: absolute;
        top: 6rem;
        right: 2rem;
        width: 15rem;
        margin: 1rem 0 0 0;

        background-color: var(--primary-dark);
        
        border-radius: 1rem;
        border-color: transparent;
        
        display: flex;
        flex-direction: column;
        transition: height 0.2s ease-in-out;
        overflow: hidden;
        height: 0px;
    }

    #profile-dropdown {
        z-index: 100;
    }
    

    #profile-content:hover #profile-dropdown, #profile-content:active #profile-dropdown, #profile-content:focus #profile-dropdown {
        border: 0.2rem solid var(--secondary-dark);
        height: 11.5rem;
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
        border-bottom: 0.2rem solid var(--secondary-dark);
        border-radius: 0;
        color: var(--text-color);
        background-color: var(--primary);
        font-family: var(--font-family);
    }

    #profile-dropdown button:first-of-type {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
    }

    #profile-dropdown button:last-child {
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        border-bottom: none;
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

    #tag-search-suggestions {
        position: relative;
        max-width: 40rem;
        width: 100%;
        margin: 0 auto;
        margin-top: -3rem;
        z-index: 300;
    }

    #tag-search-suggestions :global(div) {
        cursor: pointer;
        padding: 0.5rem;
        border-bottom: 0.2rem solid var(--secondary-dark);
        text-align: center;
    }


    @media (max-width: 800px) {
        #search {
            margin: 0;
        }

        .modal-content {
            width: 80vw;
        }
    }

    @media (max-width: 650px) {
        #navBar {
            padding: 0 1rem 0 1rem;
        }

        #mobile-search {
            padding: 0;
        }

        #profile-content:hover #profile-dropdown, #profile-content:active #profile-dropdown, #profile-content:focus #profile-dropdown {
            right: 1rem;
        }
    }

    @media (max-width: 500px) {
        #search-modal {
            padding-top: 20rem;
        }
    }
</style>