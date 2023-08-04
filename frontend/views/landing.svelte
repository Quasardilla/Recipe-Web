<script>
    import CardCarrousel from "../modules/cardCarrousel.svelte";
    let scripts = require('../sharedScripts.js')
    import test1 from "../assets/imgs/test1.png";
    import test2 from "../assets/imgs/test2.jpg";
    import test3 from "../assets/imgs/test3.png";
    import test4 from "../assets/imgs/test4.jpg";

    //IIFE to run as soon as it's defined, not waiting for page to load
    (() => {
        scripts.requestWithToken('https://kitchen.quasardilla.com/api/tokens/', 'GET')
        .then((response) => {
            if(response.status == 200) {
                window.location.href = 'https://kitchen.quasardilla.com/#/home'
            }
        })
    })()

</script>

<main>
    <div id="hero-banner">
        <img alt="hero banner"/>
    </div>

    <CardCarrousel cards={[
    {   
        img: test1, 
        text: '1'
    },
    {   
        img: test2, 
        text: '2'
    },
    {   
        img: test3, 
        text: '3'
    },
    {   
        img: test4, 
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
        height: 50rem;
        background-repeat: no-repeat;
    }
</style>