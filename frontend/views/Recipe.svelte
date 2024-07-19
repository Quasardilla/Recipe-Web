<script>
    let scripts = require('../sharedScripts.js')
    const stars = require('../assets/icons/Stars.svg')
    const starShadows = require('../assets/icons/StarShadows.svg')
    // const placeholder = require('../assets/imgs/PlaceHolder.png')
    const placeholder = require('../assets/imgs/KitchenPlaceHolder.svg')

    export let params = {};

    let recipeUUID = params.recipeUUID;
    let recipeData;
    let unitTranslated = false;
    let translatedIngredients = [];

    (async () => {
        recipeData = await (await scripts.request('https://kitchen.quasardilla.com/api/recipes/' + recipeUUID, 'GET')).json()
        recipeData.recipe.ingredients = JSON.parse(recipeData.recipe.ingredients)
        recipeData.recipe.steps = JSON.parse(recipeData.recipe.steps)
        setRating();
        console.log(recipeData)
    })()

    function getUpdatedOn() {
        let d = new Date(recipeData.recipe.updatedAt)
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let str = "";

        str += months[d.getMonth()];
        str += " " + d.getDate();
        str += ", " + d.getFullYear();
        return str;
    }

    function getCreatedOn() {
        let d = new Date(recipeData.recipe.createdAt)
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let str = "";

        str += months[d.getMonth()];
        str += " " + d.getDate();
        str += ", " + d.getFullYear();
        console.log(str)
        return str;
    }


    async function setRating() {
        // gap is 15.5/596 total width between each star and the initial border
        // star width is 101/596 of the total width
        let rating = recipeData.recipe.rating;
        if(!rating) rating = 0;

        let stars = document.getElementById('stars')
        let width = stars.width;

        let gapWidth = (15.5 / 596) * width;
        let starWidth = (101 / 596) * width;

        // let distance = gapWidth + gapWidth + gapWidth + starWidth + starWidth + starWidth/2;
        let distance = (Math.ceil(rating) * gapWidth) + (rating * starWidth);

        stars.style.clipPath = `rect(0 ${distance}px auto 0)`;
    }

    function changeUnits() {
        unitTranslated = true;

    }
</script>

<main class="flex-column flex-center">
    <div id="recipe-banner"></div>
    <div id="recipe-container">
        <p class="title">{recipeData ? recipeData.recipe.title : "Title"}</p>
        <div class="flex-row">
            <div id="rating-container">
                <img id="stars" src={stars} alt="stars">
                <img id="star-shadows" src={starShadows} alt="star-shadows">
                <p class="rating-text">{recipeData && recipeData.recipe.ratingCount ? recipeData.recipe.ratingCount : 'No ratings yet!'}</p>
            </div>
            <div id="user-info-container">
                <!-- <img alt="user-icon"> -->
                <p class="username">By: {recipeData ? recipeData.user.username : "User"}</p>
                <p class="date">{recipeData ? "Created on: " + getCreatedOn() : ""}</p>
                <p class="date">{recipeData ? "Updated on: " + getUpdatedOn() : ""}</p>
            </div>
        </div>
        <div class="image-container flex-row flex-center">
            <img id="main-food-img" src={recipeData && recipeData.recipe.image ? recipeData.recipe.image : placeholder} alt="food-main">
        </div>
        <p class="description">{recipeData ? recipeData.recipe.description : "Description"}</p>
        <div class="ingredients-container">
            {#if recipeData}
                {#each recipeData.recipe.ingredients as ingredient}
                    <div class="ingredient flex-row">
                        <button><img alt="checkbox"></button>
                        {#if unitTranslated}
                            <p>{translatedIngredients.amount ? translatedIngredients.amount : ''} {translatedIngredients.unit ? translatedIngredients.unit : ''} of {ingredient.name}</p>
                        {:else}
                            <p>{ingredient.amount ? ingredient.amount : ''} {ingredient.unit ? ingredient.unit + (ingredient.amount <= 1 ? 's' : '') : ''} of {ingredient.name}</p>
                        {/if}
                    </div>    
                {/each}
            {/if}
        </div>
    </div>
</main>

<style>
    main {
        width: 100%;
        background-color: #eee;
    }

    #recipe-banner {
        content: '';
        width: 100%;
        height: 20rem;
        background-color: #ccc;
    }

    #recipe-container {
        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;
        min-width: 60rem;
        height: 100%;
        margin: 0 27vw 1rem 27vw;
        padding: 0 3rem;
        background-color: #fff;
    }

    #rating-container {
        position: relative;
        width: 35%;
        max-width: 200px;
    }

    #stars {
        position: absolute;
        top: 0;
        width: 100%;
        margin: 0.5rem 0;

        clip-path: rect(0 0px auto 0);

        z-index: 10;
    }
    
    #star-shadows {
        position: relative;
        top: 0;
        width: 100%;
        margin: 0.5rem 0;

        z-index: 5;
    }

    .rating-text {
        font-size: 1.5rem;
        margin: 0.5rem 0 0 1rem;
    }

    #user-info-container {
        width: 55%;
        margin: 0 0 0 10%;
    }

    .title {
        font-size: 8rem;
        margin: -5.5rem 0 0.5rem 0;
        padding: 0 2rem;

        width: 100%;
    }

    .description {
        font-size: 2rem;
        margin: 2rem;
    }

    .username {
        font-size: 2rem;
        margin: 1rem 0;
    }

    .date {
        font-size: 1.5rem;
        margin: 0.5rem 0;
    }

    #main-food-img {
        object-fit: contain;
        max-width: 100%;
        max-height: 50rem;
        width: auto;
        height: 100%;
        border-radius: .5rem;
    }

    .ingredients-container {
        display: grid;
        grid-template-columns: auto auto;
    }

    @media only screen and (max-width: 800px) {
        .title {
            font-size: 8vw;
            margin: -5vw 0 0.5rem 0;
        }

        #recipe-container {
            margin: 0 8vw 1rem 8vw;
            padding: 0 1rem;
            min-width: 0;
        }

        .username {
            font-size: 3vw;
            margin: 1rem 0;
        }

        .description {
            font-size: 3vw;
            margin: 2rem;
        }

        .date {
            font-size: 2.5vw;
            margin: 0.5rem 0;
        }
    }

    @media only screen and (max-width: 500px) {
        .title {
            font-size: 4rem;
            margin: -2.5rem 0 0.5rem 0;
        }

        #recipe-container {
            margin: 0 4vw 1rem 4vw;
            padding: 0 1rem;
        }

        .username {
            font-size: 1.75rem;
            margin: 1rem 0;
        }

        .description {
            font-size: 1.75rem;
            margin: 2rem;
        }

        .date {
            font-size: 1.25rem;
            margin: 0.5rem 0;
        }
    }
</style>