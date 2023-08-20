<script>
    import CardCarrousel from "../modules/cardCarrousel.svelte";
    import placeholder from "../assets/imgs/KitchenPlaceHolder.svg";
    let scripts = require('../sharedScripts.js');

    (() => {
        scripts.requestWithToken('https://kitchen.quasardilla.com/api/tokens/', 'GET')
        .then((response) => {
            if(response.status == 200)
                window.location.href = 'https://kitchen.quasardilla.com/#/home';
        })
    })()
</script>

<main>
    <div id="hero-banner">
        <img alt="hero banner" src={placeholder}/>
    </div>

    <CardCarrousel cards={[
    {   
        img: placeholder, 
        text: '1'
    },
    {   
        img: placeholder, 
        text: '2'
    },
    {   
        img: placeholder, 
        text: '3'
    },
    {   
        img: placeholder, 
        text: '4'
    },
]}/>
</main>

<style>
    #hero-banner {
        width: 100%
    }

    #hero-banner img {
        width: 100%;
        height: 70rem;
        background-repeat: no-repeat;
    }
</style>