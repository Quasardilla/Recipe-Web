<script>
import CardCarrousel from "../modules/cardCarrousel.svelte";
import test1 from "../assets/icons/test1.png";
import test2 from "../assets/icons/test2.jpg";
import test3 from "../assets/icons/test3.png";
import test4 from "../assets/icons/test4.jpg";
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