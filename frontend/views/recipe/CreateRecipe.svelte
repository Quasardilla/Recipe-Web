<script>
    import Icon from '../../modules/Icon.svelte';
    import {onMount} from 'svelte';

    const scripts = require('../../sharedScripts.js')
    const recipeUtil = require('./recipeScripts')

    const stars = require('../../assets/icons/Stars.svg')
    const starShadows = require('../../assets/icons/StarShadows.svg')
    const placeholder = require('../../assets/imgs/KitchenPlaceHolder.svg')

    let metricUnits = scripts.metricUnits
    let standardUnits = scripts.standardUnits

    let userData;
    let steps = [''];
    let ingredients = [{}];
    let unitSelectorShown = false;
    let isRegionStandard = true;
    let unitSection = 'fluid';

    let currentUnitSelectorElement;
    let currentUnitSelectorIndex;

    //IIFE to run as soon as it's defined, not waiting for page to load
    (async () => {
        let res = await scripts.protectedRequest('https://kitchen.quasardilla.com/api/tokens/', 'GET')
        userData = (await res.json()).user
    })()

    onMount(() => {
        let params = recipeUtil.getSavedRecipe();

        ingredients = params[0]
        steps = params[1]

        ingredients = ingredients;
        steps = steps;
    });

    function changeUnitRegion() {
        isRegionStandard = !isRegionStandard;
    }

    function setUnitSection(section) {
        unitSection = section;
    }

    function showUnitSelector(event) {
        let button = event.srcElement;
        let selector = document.getElementById('unit-selector');
        selector.style.top = (button.offsetTop + button.offsetHeight + 2);
        selector.style.left = button.offsetLeft;
        currentUnitSelectorIndex = button.id.split('-')[2];    

        if(button.offsetLeft + selector.clientWidth > window.innerWidth) {
            selector.style.left = window.innerWidth - selector.clientWidth;
        }

        if(currentUnitSelectorElement === button.id)
            unitSelectorShown = !unitSelectorShown;
        else {
            currentUnitSelectorElement = button.id;
            unitSelectorShown = true;
        }
    }

    function setUnit(unit) {
        recipeUtil.saveCurrentRecipe(ingredients, steps);
        ingredients[currentUnitSelectorIndex].unit = unit;
        ingredients = ingredients;

        unitSelectorShown = false;
    }

    async function submitRecipe() {
        let recipe = await recipeUtil.recipeToJSON(ingredients, steps);

        for(let i = 0; i < ingredients.length; i++) {
            if(ingredients[i].unit)
                ingredients[i].unit = ingredients[i].unit.name;
        }

        console.log(recipe)

        scripts.protectedRequest('https://kitchen.quasardilla.com/api/recipes/', 'POST', recipe)
        .then(async (response) => {
            if(response.status == 200) {
                response = await response.json();
                localStorage.removeItem('unsavedRecipe');
                window.location.href = 'https://kitchen.quasardilla.com/#/recipe/' + response.UUID;
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

</script>

<main class="flex-column flex-center">
    <div id="recipe-banner"></div>
    <form id="recipe-container" class="flex-column" autocomplete="off" on:submit|preventDefault={submitRecipe}>
        <textarea class="title" id="title" placeholder="Title" name='title' autocomplete="off" rows='1' maxlength="30" wrap="soft" on:change={scripts.textareaChanged} on:change={recipeUtil.saveCurrentRecipe(ingredients, steps)} required></textarea>
        <div class="flex-row">
            <div id="rating-container">
                <img id="stars" src={stars} alt="stars">
                <img id="star-shadows" src={starShadows} alt="star-shadows">
                <p class="rating-text">No ratings yet!</p>
            </div>
            <div id="user-info-container">
                <p class="username">By: {userData ? userData.username : 'User'}</p>
                <p class="date">{"Published on: " + scripts.getTime()}</p>
                <p class="date">{"Edited on: " + scripts.getTime()}</p>
            </div>
        </div>
        <hr>
        <div class="flex-row recipe-info-div">
            <div class="flex-col">
                <div class="flex-row">
                    <p>Cook time:</p> <input type="number" id="cooktime" name="cooktime" min="0" max="10080" required on:change={recipeUtil.saveCurrentRecipe(ingredients, steps)}> <p>minutes</p>
                </div>
                <div class="flex-row">
                    <p>Prep time:</p> <input type="number" id="preptime" name="preptime" min="0" max="10080" required on:change={recipeUtil.saveCurrentRecipe(ingredients, steps)}> <p>minutes</p>
                </div>
            </div>
            <div class="flex-row">
                <p>Servings:</p> <input type="number" id="servings" name="servings" min="0" max="500" required on:change={recipeUtil.saveCurrentRecipe(ingredients, steps)}>
            </div>
        </div>
        <div class="image-container flex-row flex-center">
            <img id="main-food-img" src={placeholder} alt="food-main">
        </div>
        <textarea type="text" class="large-textarea" id="description" placeholder="About this dish..." name='description' autocomplete="off" maxlength="500" rows='5' required on:change={recipeUtil.saveCurrentRecipe(ingredients, steps)}></textarea>
        
        <p class="header">Ingredients</p>
        <hr>

        <div class="ingredients-container">
            {#each ingredients as ingredient, i}
                <div class="flex-row">
                    <input class="ingredient-amount" type="number" name="ingredientAmount" min="0" max="1000" step=".001" placeholder="Qty" bind:value={ingredient.amount} required on:change={recipeUtil.saveCurrentRecipe(ingredients, steps)}>
                    <button type="button" id="unit-selector-{i}" on:click={showUnitSelector}>{(ingredient.unit ? ingredient.unit.abbreviation : 'Unit')}</button>
                    <input class="ingredient-name" type="text" name="ingredientName" placeholder="Ingredient" bind:value={ingredient.name} required on:change={recipeUtil.saveCurrentRecipe(ingredients, steps)}>
                    <button class="ingredient-delete" type="button" on:click={() => {recipeUtil.removeIngredient(ingredients, ingredients.indexOf(ingredient)); ingredients = ingredients}}><Icon name="trash"/></button>
                </div>
            {/each}
            <p class="input-error" id="ingredient-err"></p>
        </div>
        <div id="unit-selector" class="{unitSelectorShown ? '' : 'hidden'}">
            <button type="button" id="unit-region" class="flex-row" on:click={changeUnitRegion}>
                <p class="{isRegionStandard ? 'selected' : ''}">Standard</p>
                <p class="{!isRegionStandard ? 'selected' : ''}">Metric</p>
            </button>

            <div class="flex-row">
                <div id="unit-section-selector" class="flex-column">
                    <button type="button" class="{unitSection === 'fluid' ? 'active' : ''}" on:click={() => {setUnitSection('fluid')}}>Fluid</button>
                    <button type="button" class="{unitSection === 'dry' ? 'active' : ''}" on:click={() => {setUnitSection('dry')}}>Dry</button>
                    <button type="button" class="{unitSection === 'weight' ? 'active' : ''}" on:click={() => {setUnitSection('weight')}}>Weight</button>
                    <button type="button" class="{unitSection === 'estimate' ? 'active' : ''}" on:click={() => {setUnitSection('estimate')}}>Estimate</button>
                </div>
                <div class="flex-row">
                    <div id='fluid-units' class="{unitSection === 'fluid' ? 'grid' : 'hidden'}">
                        {#if isRegionStandard}
                            {#each standardUnits.fluid as unit}
                                <button type="button" on:click={() => {setUnit(unit)}}>{unit.name}</button>
                            {/each}
                        {:else}
                            {#each metricUnits.fluid as unit}
                                <button type="button" on:click={() => {setUnit(unit)}}>{unit.name}</button>
                            {/each}
                        {/if}
                    </div>
                    <div id='dry-units' class="{unitSection === 'dry' ? 'grid' : 'hidden'}">
                        {#if isRegionStandard}
                            {#each standardUnits.dry as unit}
                                <button type="button" on:click={() => {setUnit(unit)}}>{unit.name}</button>
                            {/each}
                        {:else}
                            {#each metricUnits.dry as unit}
                                <button type="button" on:click={() => {setUnit(unit)}}>{unit.name}</button>
                            {/each}
                        {/if}
                    </div>
                    <div id='weight-units' class="{unitSection === 'weight' ? 'grid' : 'hidden'}">
                        {#if isRegionStandard}
                            {#each standardUnits.weight as unit}
                                <button type="button" on:click={() => {setUnit(unit)}}>{unit.name}</button>
                            {/each}
                        {:else}
                            {#each metricUnits.weight as unit}
                                <button type="button" on:click={() => {setUnit(unit)}}>{unit.name}</button>
                            {/each}
                        {/if}
                    </div>
                    <div id='Estimate-units' class="{unitSection === 'estimate' ? 'grid' : 'hidden'}">
                        {#if isRegionStandard}
                            {#each standardUnits.estimate as unit}
                                <button type="button" on:click={() => {setUnit(unit)}}>{unit.name}</button>
                            {/each}
                        {:else}
                            {#each metricUnits.estimate as unit}
                                <button type="button" on:click={() => {setUnit(unit)}}>{unit.name}</button>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <button type='button' class="primary-button" on:click={() => {recipeUtil.addIngredient(ingredients); ingredients = ingredients;}}>Add Ingredient</button>
        
        <p class="header">Steps</p>
        <div class="steps">
            <hr>
            {#each steps as step, i}
                <div class="flex-row flex-center">
                    <p class="step-num">{i + 1}. </p>
                    <textarea type="text" class="step" name="steps" bind:value={step} required wrap='soft' rows='2' on:change={recipeUtil.saveCurrentRecipe(ingredients, steps)}></textarea>
                    <button type="button" on:click={() => {recipeUtil.removeStep(steps, i); steps = steps;}}><Icon name="trash"/></button>
                </div>
                <hr>
            {/each}
            <p class="input-error" id="step-err"></p>
        </div>
        <button type='button' class="primary-button" on:click={() => {recipeUtil.addStep(steps); steps = steps;}}>Add Step</button>


        <p class="header">Notes</p>
        <hr>
        <textarea type="text" class="large-textarea" id="notes" placeholder="Notes from the chef" name='notes' autocomplete="off" maxlength="500" rows='5' on:input={recipeUtil.saveCurrentRecipe(ingredients, steps)}></textarea>

        <p class="header">Tags</p>
        <hr>
        <div class="form-group">
            <input type="text" id="tags" name="tags" maxlength="1650" placeholder="Tag anything from ingredients to cooking style!" required on:input={(event) => {scripts.refreshTagAutoComplete(event, 'tagSuggestions')}} on:change={recipeUtil.saveCurrentRecipe(ingredients, steps)}>
            <p class="input-error" id="tag-err"></p>
        </div>

        <div id="tagSuggestions"></div>
    
        <br>
        <button type="submit">Submit</button>
    </form>


</main>

<style>
    main {
        width: 100%;
        background-color: var(--primary-dark);
    }

    .header {
        font-size: 3rem;
        margin: 4rem 1rem 0 1rem;
        text-align: center;
    }

    textarea {
        resize: vertical;
    }

    .large-textarea {
        font-size: 2rem;
        margin: 2rem;
        margin-top: 0;

        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;
    }

    #recipe-container .primary-button {
        font-size: 2rem;
        margin: 1rem auto;
        padding: 1rem;
    }

    #recipe-banner {
        content: '';
        width: 100%;
        height: 20rem;
        background-color: var(--secondary);
    }

    #recipe-container {
        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;
        min-width: 60rem;
        height: 100%;
        margin: 0 27vw 5rem 27vw;
        padding: 0 3rem 3rem 3rem;
        background-color: var(--primary);

        justify-content: center;
    }

    #recipe-container hr {
        border: none;
        border-top: 0.2rem solid var(--secondary-dark);
        margin-top: 1rem;
        margin-bottom: 1rem;
        width: 65%;
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

    #recipe-container input, #recipe-container textarea {
        background-color: var(--secondary-dark);
    }

    #recipe-container input::placeholder, #recipe-container textarea::placeholder {
        color: var(--text-color-dark);
        border: none;
    }

    .title {
        font-size: 8rem;
        margin: -5.5rem 0 0.5rem 0;
        padding: 0 2rem;

        width:100%
    }

    .username {
        font-size: 2rem;
        margin: 1rem 0;
    }

    .date {
        font-size: 1.5rem;
        margin: 0.5rem 0;
    }

    .recipe-info-div {
        margin: 0 0 1rem 0;
    }

    .recipe-info-div input {
        height: 4rem;
        width: 6rem;
        padding-right: 0.5rem;
        margin: 0 0.5rem;
    }

    .recipe-info-div>.flex-col {
        width: 35%;
    }

    .recipe-info-div>.flex-row {
        margin: 0 0 0 10%;
    }

    .recipe-info-div .flex-row {
        align-items: center;
    }

    #main-food-img {
        object-fit: contain;
        max-width: 100%;
        max-height: 50rem;
        width: auto;
        height: 100%;
        border-radius: .5rem;

        margin: 2rem;
    }

    .ingredients-container {
        display: grid;
        grid-template-columns: repeat(2, minmax(50%, auto));
    }

    .ingredients-container>div {
        max-width: 100%;
        margin: 0.5rem 0.5rem
    }

    .ingredients-container input, .ingredients-container button {
        margin: 0 0.25rem;
    }

    .ingredients-container .ingredient-amount, .ingredients-container .ingredient-unit {
        width: 20%;
        font-size: 1.5rem;
        padding-right: 0;
    }
    
    .ingredients-container .ingredient-name {
        width: 40%;
        font-size: 1.5rem;
    }

    .ingredients-container .ingredient-delete {
        margin-left: 1rem;
        padding: 0;
        width: auto;
        height: 100%;
        background: none;
    }

    #unit-selector {
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--secondary);
        border: 0.2rem solid var(--secondary-dark);
        border-radius: 1rem;
        z-index: 10;
    }

    #unit-selector #unit-region {
        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;
        margin: 0.5rem;
        padding: 0;
        border-radius: 5rem;
    }

    #unit-selector #unit-region p {
        margin: 0;
        width: 100%;
        padding: 0.5rem;
        border: 0.2rem solid var(--secondary-dark);
        border-radius: 5rem;
    }

    #unit-selector #unit-region p.selected {
        background-color: var(--primary-dark);
    }

    #unit-selector #unit-section-selector button {
        margin: 0 0 0.5rem 0.5rem;
    }

    #unit-selector #unit-section-selector button:first-of-type {
        margin: 0.5rem 0 0.5rem 0.5rem;
    }

    #unit-selector #unit-section-selector button.active {
        background-color: var(--primary-dark);
    }

    #unit-selector .grid button {
        min-height: 4rem;
        max-height: 6rem;
    }

    #unit-selector .grid {
        min-width: 15rem;
        max-width: 30rem;
        height: 15rem;
        border: 0.2rem solid var(--secondary-dark);
        background-color: var(--primary);
        border-radius: 0.5rem;
        margin: 0.5rem;
        padding: 0.5rem;

        display: grid;
        row-gap: 0.5rem;
        column-gap: 0.5rem;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: min-content;

        scroll-behavior: smooth;
        overflow-y: scroll;
    }

    #recipe-container .steps .step-num {
        color: var(--text-color-dark);
        font-size: 2.5rem;
        margin: 0.5rem;
    }

    #recipe-container .steps .step {
        margin: 0.5rem;
        width: 100%;
    }

    #recipe-container .steps button {
        margin-left: 1rem;
        padding: 0;
        width: 4rem;
        height: 4rem;
        background: none;
    }

    #tags {
        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;

        margin: 0 2rem;
        padding: 0.5rem;
        font-size: 1.5rem;
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