<script>
    import Icon from '../../modules/Icon.svelte';
    import NotFound from '../404.svelte'
    import { onMount } from 'svelte'
    let scripts = require('../../sharedScripts.js')
    let recipeUtil = require('./recipeScripts')
    const stars = require('../../assets/icons/Stars.svg')
    const starShadows = require('../../assets/icons/StarShadows.svg')
    const placeholder = require('../../assets/imgs/KitchenPlaceHolder.svg')

    export let params = {};

    let recipeUUID = params.recipeUUID;
    let recipeData;
    let unitTranslated = false;
    let translatedIngredients = [];
    let owner = false;

    (async () => {
        let res = await scripts.request('https://kitchen.quasardilla.com/api/recipes/' + recipeUUID, 'GET')
        recipeData = await (res).json()

        recipeData.recipe.ingredients = JSON.parse(recipeData.recipe.ingredients)
        recipeData.recipe.steps = JSON.parse(recipeData.recipe.steps)

        recipeData = scripts.unEscapeRecipe(recipeData)

        console.log(recipeData)

        scripts.requestWithToken('https://kitchen.quasardilla.com/api/tokens/', 'GET')
        .then(async (response) => {
            if(response.status == 200) {
                response = await response.json();
                let userUUID = response.user.UUID;
                if(userUUID == recipeData.recipe.owner) {
                    owner = true;
                    console.log('owner true');
                } else {
                    owner = false;
                    console.log('owner false');
                }
            }
        })
    })()

    function revealDeleteModel() {
        document.getElementById('delete-modal').style.display = 'initial';
        document.getElementById('logout-modal').style.display = 'none';
    }

    function hideDeleteModel() {
        document.getElementById('delete-modal').style.display = 'none';
    }

    function deleteRecipe() {
        scripts.requestWithToken('https://kitchen.quasardilla.com/api/recipes/' + recipeUUID, 'DELETE')
        .then((response) => {
            if(response.status == 200) {
                window.location.href = 'https://kitchen.quasardilla.com/#/home';
            }
        })
    }

    function editRecipe() {
        if(owner) {
            window.location.href = 'https://kitchen.quasardilla.com/#/recipe/edit/' + recipeUUID;
        }
    }

    function changeUnits() {
        unitTranslated = true;

    }
</script>

<main class="flex-column flex-center" id="recipe-main">
    {#if recipeData == null}
        <NotFound />
    {:else}
        <div id="recipe-banner" class="flex-row">
            {#if owner}
                <div id="settings-content" class="flex-column" style="display: {owner ? "flex" : "none"}">
                    <button><Icon name="settings"/></button>
                    <div id="settings-dropdown" tabindex="-1">
                        <button on:click={editRecipe}>Edit Recipe</button>
                        <button on:click={revealDeleteModel}>Delete Recipe</button>
                    </div>
                </div>
            {/if}
        </div>
        <div id="recipe-container">
            <p class="title">{recipeData ? recipeData.recipe.title : "Title"}</p>
            <div class="tags">
                {#each recipeData.recipe.tags as tag}
                    <span class="tag">{tag.name} {tag.count}</span>
                {/each}
            </div>
            <div class="flex-row">
                <div id="rating-container">
                    <img id="stars" src={stars} alt="stars" on:load={recipeUtil.setRating(recipeData)}>
                    <img id="star-shadows" src={starShadows} alt="star-shadows">
                    <p class="rating-text">{recipeData && recipeData.recipe.ratingCount ? recipeData.recipe.ratingCount : 'No ratings yet!'}</p>
                </div>
                <div id="user-info-container">
                    <!-- <img alt="user-icon"> -->
                    <p class="username">By: {recipeData ? recipeData.user.username : "User"}</p>
                    <p class="date">{recipeData ? "Published on: " + new Date(recipeData.recipe.createdAt).toLocaleDateString() : ""}</p>
                    <p class="date">{recipeData ? "Edited on: " + new Date(recipeData.recipe.updatedAt).toLocaleDateString() : ""}</p>
                </div>
            </div>
            <div class="image-container flex-row flex-center">
                <img id="main-food-img" src={recipeData && recipeData.recipe.image ? recipeData.recipe.image : placeholder} alt="food-main">
            </div>
            
            <h1 class="header">Description</h1>
            <hr>
            <p class="description">{recipeData ? recipeData.recipe.description : "Description"}</p>

            <h1 class="header">Ingredients</h1>
            <hr>
            
            <div class="ingredients-container">
                {#if recipeData}
                    {#each recipeData.recipe.ingredients as ingredient}
                        <label class="checkbox-label">
                            <div class="ingredient flex-row">
                                <input class="checkbox-input" type="checkbox"/>
                                <span class="checkbox"><Icon name="checkmark"/></span>
                                {#if unitTranslated}
                                <i>translated</i>
                                <p>{translatedIngredients.amount ? translatedIngredients.amount : ''} {translatedIngredients.unit ? translatedIngredients.unit : ''} of {ingredient.name}</p>
                                {:else}
                                <p>{ingredient.amount ? ingredient.amount : ''} {ingredient.unit != 'undefined' ? ingredient.unit + (ingredient.amount <= 1 ? '' : 's') : ''} of {ingredient.name}</p>
                                {/if}
                            </div>    
                        </label>
                    {/each}
                {/if}
            </div>

            <h1 class="header">Steps</h1>
            <hr>
            
            <div class="steps">
                {#if recipeData}
                    {#each recipeData.recipe.steps as step, i}
                        <div class="flex-row flex-center">
                            <p class="step-num">{i + 1}. </p>
                            <p type="text" class="step" name="steps" required wrap='soft' rows='2'>{step}</p>
                        </div>
                        <hr>
                    {/each}
                {/if}
                <p class="input-error" id="step-err"></p>
            </div>

            <h1 class="header">Recipe Notes</h1>
            <hr>
            <p class="description">{recipeData ? recipeData.recipe.notes : "Notes"}</p>
        </div>
    {/if}

    <div id="delete-modal" class="modal" on:click|self={hideDeleteModel} on:keydown={null} role="dialog" aria-modal="true" tabindex="-1">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Delete Recipe</h2>
            </div>
            <div class="modal-body">
                <p>Are You sure you want to add this recipe to trash?</p>
                <p>You'll be able to restore it from your profile.</p>
                <p>Recipes in your trash for > 30 days will be deleted</p>
                <div class="flex-row flex-center">
                    <button on:click={deleteRecipe}>Delete Recipe</button>
                    <button on:click={hideDeleteModel}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    main {
        width: 100%;
        background-color: var(--secondary);
    }

    #recipe-banner {
        content: '';
        width: 100%;
        height: 20rem;
        background-color: var(--primary-dark);

        justify-content: right;
        align-items: top;
    }

    #recipe-banner button {
        background-color: unset;
        border: none;
    }

    #recipe-banner button {
        width: 5rem;
        height: 5rem;
    }

    #settings-content {
        align-items: end;
        margin-right: 2rem;
    }

    #settings-content #settings-dropdown {
        position: relative;
        width: 10rem;
        
        background-color: var(--primary-dark);
        
        border-radius: 1rem;
        border-color: transparent;
        
        display: flex;
        flex-direction: column;
        transition: height 0.2s ease-in-out;
        overflow: hidden;
        height: 0px;
    }

    #settings-dropdown {
        z-index: 100;
    }
    
    #settings-content:hover #settings-dropdown, #settings-content:active #settings-dropdown, #settings-content:focus #settings-dropdown {
        border: 0.2rem solid var(--secondary-dark);
        height: 10rem;
    }

    #settings-dropdown button {
        text-align: center;
        font-size: 1.4rem;
        width: 100%;
        cursor: pointer;
        border: none;
        border-bottom: 0.2rem solid var(--secondary-dark);
        border-radius: 0;
        color: var(--text-color);
        background-color: var(--primary);
        font-family: var(--font-family);
    }

    #settings-dropdown button:first-of-type {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
    }

    #settings-dropdown button:last-child {
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        border-bottom: none;
    }

    #settings-dropdown button:hover {
        background-color: var(--primary-dark);
    }

    #recipe-container {
        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;
        min-width: 60rem;
        height: 100%;
        margin: 0 20vw 5rem 20vw;
        padding: 0 3rem 7rem 3rem;
        background-color: var(--primary);
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

    .image-container {
        margin-top: 4rem;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1.5rem 0 1rem 0;
    }

    .tag {
        background-color: var(--secondary);
        border: 0.1rem solid var(--secondary-dark);
        border-radius: 1rem;
        padding: 0.2rem 1rem;
        margin: 0.4rem;
        font-size: 1.2rem;
    }

    .title {
        font-size: 8rem;
        font-weight: bold;
        margin: -5.5rem 0 0.5rem 0;
        padding: 0 2rem;

        background-color: var(--secondary-dark);
    }

    .header {
        margin: 5rem 0 1rem 0;
    }

    .description {
        font-size: 2rem;
        margin: 2rem;
        white-space: pre-line
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
        align-items: center;
        gap: 2rem;
        margin: 2rem 0 0 0;
        grid-template-columns: repeat(auto-fit, minmax(28rem, 40rem));
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .checkbox-input {
        display: none;
    }

    .checkbox {
        width: 2.5rem;
        height: 2.5rem;
        margin-right: 1rem;
        padding: 0;
        background: none;
        border: 0.3rem solid var(--tertiary);
        border-radius: 0.5rem;
    }

    .checkbox-input:checked + .checkbox {
        background-color: var(--tertiary);
    }
    
    .checkbox-input + .checkbox img {
        display: none;
    }

    .checkbox-input:checked + .checkbox img {
        display: block;
    }


    .checkbox-input:checked + .checkbox + p {
        text-decoration: line-through;
        color: var(--text-color-dark);
    }

    .ingredient, .ingredient p {
        min-width: 18rem;
        width: 100%;
        margin: 0;
        font-size: 1.8rem;
        align-items: center;
    }

    #recipe-container .steps .step-num {
        color: var(--text-color-dark);
        font-size: 2.5rem;
        margin: 0.5rem;
    }

    #recipe-container .steps .step {
        margin: 0.5rem 2rem;
        width: 100%;
        font-size: 1.8rem;
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
        #recipe-banner {
            height: 10rem;
        }


        .title {
            font-size: 4rem;
            margin: -2.5rem 0 0.5rem 0;
        }

        .tag {
            padding: 0.2rem 1rem;
            margin: 0.2rem;
            font-size: 1.2rem;
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