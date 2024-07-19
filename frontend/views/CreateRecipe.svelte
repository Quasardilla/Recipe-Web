<script>
    const stars = require('../assets/icons/Stars.svg')
    const starShadows = require('../assets/icons/StarShadows.svg')
    const placeholder = require('../assets/imgs/KitchenPlaceHolder.svg')
    const scripts = require('../sharedScripts.js')

    let userData;
    let steps = [];
    let ingredients = [{}];
    let unitSelectorShown = false;


    // let fluidUnits = [{
    //     name: 'Cup',
    //     abbreviation: 'C',
    //     toCups: 1,
    // },
    // {
    //     name: 'Tablespoon',
    //     abbreviation: 'Tbsp',
    //     toCups: 16,
    // },
    // {
    //     name: 'Teaspoon',
    //     abbreviation: 'tsp',
    //     toCups: 48,
    // },
    // {
    //     name: 'Fluid Ounce',
    //     abbreviation: 'fl oz',
    //     toCups: 8,
    // },
    // {
    //     name: 'Pint',
    //     abbreviation: 'pt',
    //     toCups: 0.5,
    // },
    // {
    //     name: 'Quart',
    //     abbreviation: 'qt',
    //     toCups: 0.25,
    // },
    // {
    //     name: 'Gallon',
    //     abbreviation: 'gal',
    //     toCups: 0.0625,
    // }
    // ]
    // let standardDryUnits = [{}]
    // let standardWeightUnits = [{}]
    // let metricDryUnits = [{}]
    // let metricWeightUnits = [{}]
    // let estimateUnits = [{}]

    //IIFE to run as soon as it's defined, not waiting for page to load
    (async () => {
        let res = await scripts.protectedRequest('https://kitchen.quasardilla.com/api/tokens/', 'GET')
        userData = (await res.json()).user
    })()

    function getTime() {
        let d = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let str = "";

        str += months[d.getMonth()];
        str += " " + d.getDate();
        str += ", " + d.getFullYear();
        return str;
    }

    function textareaChanged(event) {
        let textarea = event.srcElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    function addIngredient() {
        ingredients.push({
            unit: '',
            amount: null,
            name: ''
        });

        ingredients = ingredients;
    }

    function removeIngredient(index) {
        if(ingredients.length <= 1) return;

        ingredients.splice(index, 1)
        ingredients = ingredients;
    }

    function addStep() {
        steps.push('');
        steps = steps;
    }

    function removeStep(index) {
        if(steps.length <= 1) return;

        steps.splice(index, 1)
        steps = steps;
    }

    function submitRecipe() {
        let title = document.getElementById('title').value;
        // let thumbnail
        let description = document.getElementById('description').value;
        let ingredients = document.getElementById('ingredients').value;
        let steps = document.getElementById('steps').value;
        let cooktime = document.getElementById('cooktime').value;
        let preptime = document.getElementById('preptime').value;
        let servings = document.getElementById('servings').value;
        let notes = document.getElementById('notes').value;
        let tags = document.getElementById('tags').value;

        let recipe = {
            title: title,
            description: description,
            ingredients: ingredients,
            steps: steps,
            cooktime: cooktime,
            preptime: preptime,
            servings: servings,
            notes: notes,
            tags: tags
        }

        scripts.request('https://kitchen.quasardilla.com/api/recipes/', 'POST', recipe)
        .then((response) => {
            if(response.status == 201) {
                window.location.href = 'https://kitchen.quasardilla.com/#/home';
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }


</script>

<main class="flex-column flex-center">
    <h1>Create Recipe</h1>

    <div id="recipe-banner"></div>
    <form id="recipe-container">
        <textarea class="title" placeholder="Title" autocomplete="off" rows='1' wrap="soft" on:change={textareaChanged} required></textarea>
        <div class="flex-row">
            <div id="rating-container">
                <img id="stars" src={stars} alt="stars">
                <img id="star-shadows" src={starShadows} alt="star-shadows">
                <p class="rating-text">No ratings yet!</p>
            </div>
            <div id="user-info-container">
                <p class="username">By: {userData ? userData.username : 'User'}</p>
                <p class="date">{"Created on: " + getTime()}</p>
                <p class="date">{"Updated on: " + getTime()}</p>
            </div>
        </div>
        <div class="image-container flex-row flex-center">
            <img id="main-food-img" src={placeholder} alt="food-main">
        </div>
        <textarea type="text" class="description" id="description" placeholder="About this dish..." autocomplete="off" maxlength="2000" rows='5' required></textarea>
        <div class="ingredients-container">
            {#each ingredients as ingredient}
                <div class="flex-row">
                    <input class="ingredient-amount" type="number" name="ingredientAmount" bind:value={ingredient.amount} required>
                    <input class="ingredient-unit" type="button" name="ingredientUnit" bind:value={ingredient.unit}>
                    <input class="ingredient-name" type="text" name="ingredientName" bind:value={ingredient.name} required>
                    <button class="ingredient-delete" type="button" on:click={removeIngredient(ingredients.indexOf(ingredient))}>Remove</button>
                </div>
            {/each}
        </div>
        <div id="unit-selector" class="{unitSelectorShown ? '' : 'hidden'}">
            <div>
                <button class="flex-row">
                    <p>Standard</p>
                    <p>Metric</p>
                </button>
                <div class="flex-row">
                    <div id="unit-section-selector">
                        <button>Fluid</button>
                        <button>Dry</button>
                        <button>Weight</button>
                        <button>Estimate</button>
                    </div>
                    <div id='fluid-units'>

                    </div>
                    <div id='dry-units'>

                    </div>
                    <div id='weight-units'>

                    </div>
                    <div id='Estimate-units'>

                    </div>
                </div>
            </div>
        </div>
        <button type='button' on:click={console.log(ingredients)}>Print Ingredients</button>
        <button type='button' on:click={addIngredient}>Add Ingredient</button>
    </form>


    <p class="input-header" for="description">Description</p>
    <textarea type="text" id="description" name="description" required></textarea>

    <p class="input-header" for="cooktime">Cook Time</p>
    <input type="number" id="cooktime" name="cooktime" required>

    <p class="input-header" for="cooktime">Prep Time</p>
    <input type="number" id="cooktime" name="cooktime" required>

    <p class="input-header" for="servings">Servings</p>
    <input type="number" id="servings" name="servings" required>

    <p class="input-header" for="notes">Notes</p>
    <input type="text" id="notes" name="notes">

    <p class="input-header" for="steps">Steps</p>
    <input type="text" id="steps" name="steps" required>

    <p class="input-header" for="tags">Tags</p>
    <input type="text" id="tags" name="tags" required on:input={scripts.refreshTagAutoComplete}>
    <div id="tagSuggestions"></div>

    <br>
    <button type="submit">Submit</button>
</main>

<style>
    main {
        width: 100%;
        background-color: #eee;
    }

    textarea {
        resize: vertical;
    }

    .input-header {
        font-size: 1.5rem;
        margin: 1rem 0 0.5rem 0;
    }

    #tagSuggestions {
        background-color: #ccc;
    }

    #tagSuggestions :global(div) {
        padding: 0.5rem;
        border: 2px solid #aaa;
        border-top: none;
        cursor: pointer;
    }

    #tagSuggestions :global(div):nth-child(1) {
        padding: 0.5rem;
        border: 2px solid #aaa;
        cursor: pointer;
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

        width:100%
    }
    
    .description {
        font-size: 2rem;
        margin: 2rem;

        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;
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
        grid-template-columns: repeat(2, minmax(50%, auto));
    }

    .ingredients-container>div {
        max-width: 100%;
        margin: 0.5rem 0.5rem
    }

    .ingredients-container .ingredient-amount, .ingredients-container .ingredient-unit {
        width: 20%;
        font-size: 1.5rem;
    }
    
    .ingredients-container .ingredient-name {
        width: 40%;
        font-size: 1.5rem;
    }

    .ingredients-container .ingredient-delete {
        width: 20%;
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