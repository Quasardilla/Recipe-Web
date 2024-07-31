<script>
    import Icon from '../modules/Icon.svelte';

    const stars = require('../assets/icons/Stars.svg')
    const starShadows = require('../assets/icons/StarShadows.svg')
    const placeholder = require('../assets/imgs/KitchenPlaceHolder.svg')
    const scripts = require('../sharedScripts.js')

    let userData;
    let steps = [''];
    let ingredients = [{}];
    let unitSelectorShown = false;
    let isRegionStandard = true;
    let unitSection = 'fluid';

    let standardUnits = {
        fluid: [{
            name: 'Fluid Ounce',
            abbreviation: 'fl oz',
            toCups: 8,
            toLiters: 35.19508,
        },
        {
            name: 'Pint',
            abbreviation: 'pt',
            toCups: 0.5,
            toLiters: 1.759754,
        },
        {
            name: 'Quart',
            abbreviation: 'qt',
            toCups: 0.25,
            toLiters: 0.8798771,
        },
        {
            name: 'Gallon',
            abbreviation: 'gal',
            toCups: 0.0625,
            toLiters: 0.2199693,
        }],
        dry: [{
            name: 'Cup',
            abbreviation: 'C',
            toCups: 1,
            toLiters: 3.519508,
        },
        {
            name: 'Tablespoon',
            abbreviation: 'Tbsp',
            toCups: 16,
            toLiters: 56.31213,
        },
        {
            name: 'Teaspoon',
            abbreviation: 'tsp',
            toCups: 48,
            toLiters: 168.9364,
        }],
        weight: [{
            name: 'Ounce',
            abbreviation: 'oz',
            toPounds: 16,
            toKilograms: 35.27396,
        },
        {
            name: 'Pound',
            abbreviation: 'lb',
            toPounds: 1,
            toKilograms: 2.204623,
        }],
        estimate: [{
            name: 'Pinch',
            abbreviation: 'pinch',
        },
        {
            name: 'Dash',
            abbreviation: 'dash',
        },
        {
            name: 'Handful',
            abbreviation: 'handful',
        },
        {
            name: 'Sprinkle',
            abbreviation: 'sprinkle',
        },
        {
            name: 'Dollop',
            abbreviation: 'dollop',
        },
        {
            name: 'Clove',
            abbreviation: 'clove',
        },
        {
            name: 'Piece',
            abbreviation: 'piece',
        },
        {
            name: 'Slice',
            abbreviation: 'slice',
        },
        {
            name: 'Leaf',
            abbreviation: 'leaf',
        },
        {
            name: 'Stalk',
            abbreviation: 'stalk',
        },
        {
            name: 'Bunch',
            abbreviation: 'bunch',
        },
        {
            name: 'Head',
            abbreviation: 'head',
        }],
    };

    let metricUnits = {
        fluid: [{
            name: 'Milliliter',
            abbreviation: 'mL',
            toLiters: 1000,
            toCups: 236.5882,
        },
        {
            name: 'Liter',
            abbreviation: 'L',
            toLiters: 1,
            toCups: 0.2365882, 
        }],
        dry: [{
            name: 'Milliliter',
            abbreviation: 'mL',
            toLiters: 1000,
            toCups: 236.5882,
        },
        {
            name: 'Tablespoon',
            abbreviation: 'Tbsp',
            toLiters: 66.6667,
            toCups: 16,
        }],
        weight: [{
             name: 'Gram',
             abbreviation: 'g',
             toKilograms: 1000,
             toPounds: 454,
        },
        {
             name: 'Kilogram',
             abbreviation: 'kg',
             toKilograms: 1,
             toPounds: 0.454,
        }],
        estimate: [{
            name: 'Pinch',
            abbreviation: 'pinch',
        },
        {
            name: 'Dash',
            abbreviation: 'dash',
        },
        {
            name: 'Handful',
            abbreviation: 'handful',
        },
        {
            name: 'Sprinkle',
            abbreviation: 'sprinkle',
        },
        {
            name: 'Dollop',
            abbreviation: 'dollop',
        },
        {
            name: 'Clove',
            abbreviation: 'clove',
        },
        {
            name: 'Piece',
            abbreviation: 'piece',
        },
        {
            name: 'Slice',
            abbreviation: 'slice',
        },
        {
            name: 'Leaf',
            abbreviation: 'leaf',
        },
        {
            name: 'Stalk',
            abbreviation: 'stalk',
        },
        {
            name: 'Bunch',
            abbreviation: 'bunch',
        },
        {
            name: 'Head',
            abbreviation: 'head',
        }],
    };

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
        if(ingredients.length > 100) {
            document.getElementById('ingredient-err').innerText = 'There is a maximum of 100 ingredients per recipe. Please remove an ingredient before adding another.';
            document.getElementById('ingredient-err').classList.remove('hidden');
            return;
        } else {
            document.getElementById('ingredient-err').classList.add('hidden');
        }

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

    async function addStep() {
        if(steps.length > 50) {
            document.getElementById('step-err').innerText = 'There is a maximum of 50 steps per recipe. Please remove a step before adding another.';
            document.getElementById('step-err').classList.remove('hidden');
            return;
        } else {
            document.getElementById('step-err').classList.add('hidden');
        }

        steps.push("")
        steps = steps;
    }

    function removeStep(index) {
        if(steps.length <= 1) return;

        steps.splice(index, 1)
        steps = steps;
    }

    async function submitRecipe() {
        let title = await document.getElementById('title').value;
        let cooktime = await document.getElementById('cooktime').value;
        let preptime = await document.getElementById('preptime').value;
        let servings = await document.getElementById('servings').value;
        let description = await document.getElementById('description').value;
        // let thumbnail
        let notes = await document.getElementById('notes').value;
        let tags = await document.getElementById('tags').value;
        tags = await scripts.sanitizeTagData(tags);

        let result = scripts.verifyTags(tags)
        if(result) {
            document.getElementById('tag-err').innerText = result;
            document.getElementById('tags').classList.remove('hidden') 
            return;
        } else {
            document.getElementById('tag-err').innerText = '';
            document.getElementById('tags').classList.add('hidden') 
        }

        for(let i = 0; i < ingredients.length; i++) {
            ingredients[i].amount = await scripts.onlyNumeric(ingredients[i].amount);
            ingredients[i].name = await scripts.sanitizeRecipeData(ingredients[i].name);
        }

        for(let i = 0; i < steps.length; i++) {
            steps[i] = await scripts.sanitizeRecipeData(steps[i]);
        }

        let recipe = {
            title: await scripts.sanitizeRecipeData(title),
            cooktime: await scripts.onlyNumeric(cooktime),
            preptime: await scripts.onlyNumeric(preptime),
            servings: await scripts.onlyNumeric(servings),
            description: await scripts.sanitizeRecipeData(description),

            ingredients: ingredients,
            steps: steps,

            notes: await scripts.sanitizeRecipeData(notes),
            tags: tags.split(' ')
        }

        // scripts.request('https://kitchen.quasardilla.com/api/recipes/', 'POST', recipe)
        // .then((response) => {
        //     if(response.status == 201) {
        //         window.location.href = 'https://kitchen.quasardilla.com/#/home';
        //     }
        // })
        // .catch((error) => {
        //     console.log(error);
        // })
    }

    let currentUnitSelectorElement;
    let currentUnitSelectorIndex;

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

    function changeUnitRegion() {
        isRegionStandard = !isRegionStandard;
    }

    function setUnitSection(section) {
        unitSection = section;
    }

    function setUnit(unit) {
        ingredients[currentUnitSelectorIndex].unit = unit;
        ingredients = ingredients;

        unitSelectorShown = false;
    }

</script>

<main class="flex-column flex-center">
    <div id="recipe-banner"></div>
    <form id="recipe-container" class="flex-column" on:submit|preventDefault={submitRecipe}>
        <textarea class="title" id="title" placeholder="Title" name='title' autocomplete="off" rows='1' wrap="soft" on:change={textareaChanged} required></textarea>
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
        <hr>
        <div class="flex-row recipe-info-div">
            <div class="flex-col">
                <div class="flex-row">
                    <p>Cook time:</p> <input type="number" id="cooktime" name="cooktime" min="0" required> <p>minutes</p>
                </div>
                <div class="flex-row">
                    <p>Prep time:</p> <input type="number" id="preptime" name="preptime" min="0" required> <p>minutes</p>
                </div>
            </div>
            <div class="flex-row">
                <p>Servings:</p> <input type="number" id="servings" name="servings" min="0" required>
            </div>
        </div>
        <div class="image-container flex-row flex-center">
            <img id="main-food-img" src={placeholder} alt="food-main">
        </div>
        <textarea type="text" class="large-textarea" id="description" placeholder="About this dish..." name='description' autocomplete="off" maxlength="500" rows='5' required></textarea>
        
        <p class="header">Ingredients</p>
        <hr>

        <div class="ingredients-container">
            {#each ingredients as ingredient, i}
                <div class="flex-row">
                    <input class="ingredient-amount" type="number" name="ingredientAmount" min="0" step=".001" placeholder="Qty" bind:value={ingredient.amount} required>
                    <button type="button" id="unit-selector-{i}" on:click={showUnitSelector}>{(ingredient.unit ? ingredient.unit.abbreviation : 'Unit')}</button>
                    <input class="ingredient-name" type="text" name="ingredientName" placeholder="Ingredient" bind:value={ingredient.name} required>
                    <button class="ingredient-delete" type="button" on:click={removeIngredient(ingredients.indexOf(ingredient))}><Icon name="trash"/></button>
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

        <button type='button' class="primary-button" on:click={addIngredient}>Add Ingredient</button>
        
        <p class="header">Steps</p>
        <div class="steps">
            <hr>
            {#each steps as step, i}
                <div class="flex-row flex-center">
                    <p class="step-num">{i + 1}. </p>
                    <textarea type="text" class="step" name="steps" bind:value={step} required wrap='soft' rows='2'></textarea>
                    <button type="button" on:click={() => {removeStep(i)}}><Icon name="trash"/></button>
                </div>
                <hr>
            {/each}
            <p class="input-error" id="step-err"></p>
        </div>
        <button type='button' class="primary-button" on:click={addStep}>Add Step</button>


        <p class="header">Notes</p>
        <hr>
        <textarea type="text" class="large-textarea" id="notes" placeholder="Notes from the chef" name='notes' autocomplete="off" maxlength="500" rows='5' required></textarea>

        <p class="header">Tags</p>
        <hr>
        <div class="form-group">
            <input type="text" id="tags" name="tags" placeholder="Tag anything from ingredients to cooking style!" required on:input={scripts.refreshTagAutoComplete}>
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