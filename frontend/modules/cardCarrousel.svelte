<script defer>
    import { onMount } from "svelte";
    import leftArrow from '../assets/icons/arrow_back.svg'
    import rightArrow from '../assets/icons/arrow_forward.svg'
    export let cards;

    let card1;
    let card2;
    let card3;
    let card4;

    const cardCount = cards.length;
    let currentPos = 0;
    let animateCards = false;
    let animateReverse = false;
    let direction = 0;

    let cardImgEls;
    let cardTextEls;

    onMount(async () => {       
        card1 = document.getElementById('card1')
        card2 = document.getElementById('card2')
        card3 = document.getElementById('card3')
        card4 = document.getElementById('card4')

        card1.style.visibility = 'hidden'
        card2.style.visibility = 'hidden'

        cardImgEls = document.getElementsByClassName('card-image')
        cardTextEls = document.getElementsByClassName('card-text')
        updateCardData();
  });

    function rotateRight() {
        if(currentPos < cardCount - 1) {
            direction = 1;
            card3.addEventListener("animationend", cardAnimationEnd, false);
            currentPos++;
            controlFrontCardVisibility();
            controlBackCardVisibility();
            updateCardData()
            animateCards = true;
        }
    }
    
    function rotateLeft() {
        if(currentPos > 0) {
            direction = -1;
            card3.addEventListener("animationend", cardAnimationEnd, false);
            currentPos--;

            animateCards = true;
            animateReverse = true;

        }    
    }

    function controlBackCardVisibility() {
        switch (currentPos) {
            case cardCount - 2:
                card4.style.visibility = 'visible'
                break;
            case cardCount - 1:
                card4.style.visibility = 'hidden'
                break;
            default:
                card4.style.visibility = 'visible'
                break;
        } 
    }

    function controlFrontCardVisibility() {
        switch (currentPos) {
            case 0:
                card1.style.visibility = 'hidden'
                card2.style.visibility = 'hidden'
                break;
            case 1:
                card2.style.visibility = 'visible'
                card1.style.visibility = 'hidden'    
                break;
            case 2:
                card1.style.visibility = 'visible'
                break;
            default:
                card1.style.visibility = 'visible'
                card2.style.visibility = 'visible'
                break;
        }
    }

    function updateCardData() {
        console.log("updating card data")

        if(currentPos - 2 >= 0) {
            cardTextEls[0].textContent = cards[currentPos - 2].text;
            cardImgEls[0].src = cards[currentPos - 2].img;
        }

        if(currentPos - 1 >= 0) {
            cardTextEls[1].textContent = cards[currentPos - 1].text;
            cardImgEls[1].src = cards[currentPos - 1].img;
        }

        cardTextEls[2].textContent = cards[currentPos].text;
        cardImgEls[2].src = cards[currentPos].img;

        if(currentPos + 1 < cardCount) {
            cardTextEls[3].textContent = cards[currentPos + 1].text;
            cardImgEls[3].src = cards[currentPos + 1].img;
        }
    }

    function cardAnimationEnd() {
        animateCards = false;
        animateReverse = false;

        console.log("animation ended")

        if(direction < 0) {
            controlFrontCardVisibility();
            controlBackCardVisibility();
            updateCardData();
        }

        card3.removeEventListener("animationend", cardAnimationEnd, false);
    }

</script>

<main>
    <div id="card-container">
        <button class="nav-button" id="left-nav-button" on:click={rotateLeft}>
            <img alt="left arrow" src={leftArrow}/>
        </button>
        
        <!--Right card (off-screen)-->
        <div class="card" id="card1" class:slide-off-right={animateCards} class:reverse={animateReverse}>
            <img class="card-image" alt="card icon"/>
            <p class="card-text"></p>
        </div>
        <!--Right card-->
        <div class="card" id="card2" class:middle-to-right={animateCards} class:reverse={animateReverse}>
            <img class="card-image" alt="card icon"/>
            <p class="card-text"></p>
        </div>
        <!--Middle card-->
        <div class="card" id="card3" class:left-to-middle={animateCards} class:reverse={animateReverse}>
            <img class="card-image" alt="card icon"/>
            <p class="card-text"></p>
        </div>
        <!--Left card-->
        <div class="card" id="card4" class:slide-from-left={animateCards} class:reverse={animateReverse}>
            <img class="card-image" alt="card icon"/>
            <p class="card-text"></p>
        </div>

        <button class="nav-button" id="right-nav-button" on:click={rotateRight}>
            <img alt="right arrow" src={rightArrow}/>
        </button>
    </div>

</main>

<style>
    .nav-button {
        width: 4%;
        height: 100%;
        align-items: center;
        justify-content: center;
        background-color: rgba(125, 125, 125, 0.10);
        border: rgba(100, 100, 100, 0.20) solid 2px;
        border-radius: 2rem;

        z-index: 10;

        transition: all 300ms ease-in-out;
    }

    .nav-button:hover {
        background-color: rgba(125, 125, 125, 0.5);
        border: rgba(100, 100, 100, 1) solid 2px;
        cursor: pointer;
    }

    .nav-button:hover img {
        filter: invert(30%);
        opacity: 1;
    }

    .nav-button img {
        opacity: 0.1;
        margin: auto;
        width: 100%;
        transition: all 300ms ease-in-out;
    }

    #card-container {
        height: 40vw;
        display: flex;
        justify-content: space-between;
        padding: 5rem 5% 0 5%;
        position: relative;
        overflow: hidden;
    }

    .card {
        border: gray solid 4px;
        background-color: rgba(125, 125, 125, 0.5);
        position: absolute;
        animation-duration: 700ms;
        animation-timing-function: ease-in-out;
        overflow: hidden;

        z-index: 5;

        box-shadow: 10px 10px 10px rgba(128, 128, 128, 0.5);
    }
    
    .card img {
        width: 100%;
        object-fit: contain;
    }

    #card1, #card2, #card4 {
        width: 12.5%;
        height: 45%;
        top: 37.5%;
        border-radius: 2.5rem;
    }

    #card1 {
        left: -50%;
    }

    #card2 {
        left: 10%;
    }
    
    #card3 {
        width: 25%;
        height: 90%;

        left: 37.5%;
        top: 5%;
        border-radius: 4rem;
    }

    #card4 {
        left: 77%;
    }

    .slide-off-right {
        animation-name: slide-off-right;
    }

    .middle-to-right {
        animation-name: middle-to-right;
    }

    .left-to-middle {
        animation-name: left-to-middle;
    }

    .slide-from-left {
        animation-name: slide-from-left;
    }

    .reverse {
        animation-direction: reverse;
    }

    @keyframes slide-off-right {
        from {left: 10%; top: 37.5%;}
        to {left: -50%; top: 37.5%;}
    }

    @keyframes middle-to-right {
        from {width: 25%; height: 90%; left: 37.5%; top: 5%; border-radius: 4rem;}
        to {width: 12.5%; height: 45%; left: 10%; top: 37.5%; border-radius: 2.5rem;}
    }

    @keyframes left-to-middle {
        from {width: 12.5%; height: 45%; left: 77%; top: 37.5%; border-radius: 2.5rem;}
        to {width: 25%; height: 90%; left: 37.5%; top: 5%; border-radius: 4rem;}
    }

    @keyframes slide-from-left {
        from {left: 150%; top: 37.5%;}
        to {left: 77%; top: 37.5%;}
    }
</style>