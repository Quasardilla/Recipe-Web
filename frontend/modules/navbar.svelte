<script>
    import KitchenIcon from '../assets/icons/KitchenIconTextTransparent2.svg';
</script>

<main>
    <nav id="navBar">
        <div id="logo">
            <a href="https://kitchen.quasardilla.com/">
                <img alt="main-icon" src={KitchenIcon}/>
            </a>
        </div>
        <div id="search">
            <img id="search-icon" alt="search-icon"/>
            <button id="search-bar-mini"></button>
        </div>
        <div id="profile-content">
            <button id="profile">
                <img alt="profile-icon"/>
            </button>

        </div>
    </nav>
</main>

<style>
    #navBar {
        height: 7rem;
        background-color: gray;
        padding: 0 2rem 0 2rem;
        align-items: center;
        display: flex;
        justify-content: space-between;
    }

    #profile-content {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    #profile {
        width: 5rem;
        height: 5rem;
    }

    #logo img {
        height: 100%;
        width: auto;
    }
</style>