<script>
    const scripts = require('../../sharedScripts.js')
    let userData;
    let userRecipes = [];

    //IIFE to run as soon as it's defined, not waiting for page to load
    (async () => {
        let userRes = await scripts.protectedRequest('https://kitchen.quasardilla.com/api/tokens/', 'GET')
        userData = (await userRes.json()).user
        let recipeRes = await scripts.request('https://kitchen.quasardilla.com/api/recipes/user/' + userData.UUID, 'GET')
        userRecipes = await recipeRes.json()

        userRecipes = scripts.unEscapeRecipe(userRecipes)

        console.log(userRecipes)
    })()
</script>

<main class="flex-column flex-center">
    <div class="home-container">    
        <h1>Your Recipes</h1>
        <div id="user-recipes">
            <a href="/#/recipe/create">
                <div class="recipe-card placeholder-card">
                    <div class="add-recipe-icon" style="font-size: 5rem; font-weight: bold;">+</div>
                    <div class="add-recipe-text">Add New Recipe</div>
                </div>
            </a>
            {#each userRecipes as recipe}
                <a href={"/#/recipe/" + recipe.UUID}>
                    <div class="recipe-card">
                        <h2>{recipe.title}</h2>
                        <p>Last Edited: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
                    </div>
                </a>
            {/each}
        </div>
    </div>

</main>

<style>
    main {
        width: 100%;
    }

    .home-container {
        width: -webkit-fill-available;
        width: -moz-available;
        width: fill-available;
        min-width: 60rem;
        height: 100%;
        margin: 0 20vw 1rem 20vw;
        padding: 0 3rem;
        background-color: var(--secondary);
    }

    #user-recipes {
        display: grid;
        grid-auto-flow: row;
        grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));

        justify-content: left;
        gap: 2rem;
        margin: 2rem;
        padding: 2rem;
        background-color: var(--primary-dark);
        border: 0.2rem solid var(--secondary-dark);

        border-radius: 2rem;

        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
    }

    #user-recipes a {
        text-decoration: none;
    }

    .recipe-card {
        width: 100%;
        height: 25rem;
        border: 1px solid var(--tertiary);
        border-radius: 10px;

        text-decoration: none;

        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;

        align-items: center;
        justify-content: center;
        text-align: center;
        background-color: var(--primary);
        transition: transform 0.2s;
    }

    @media only screen and (max-width: 500px) {
        .home-container {
            margin: 0;
            padding: 0;
            width: 100%;
            min-width: unset;
        }

        #user-recipes {
            grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
            margin: 0;
            border-radius: 0;
        }

        h1 {
            text-align: center;
        }
    }
</style>