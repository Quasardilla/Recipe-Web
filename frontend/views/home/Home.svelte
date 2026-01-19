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
        <h1 class="welcome">Welcome, {userData ? userData.username : 'user'}!</h1>
    
        <a href="/#/home/recipes" style="text-decoration: none;"><h1>Your Recipes</h1></a>
        <div id="user-recipes" class="flex-row">
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
        width: 60vw;
        height: 100%;
        margin: 0 auto 1rem auto;
        padding: 0 3rem;
        background-color: var(--secondary);
    }
    
    .welcome {
        margin-top: 20px;
        text-align: center;
    }

    #user-recipes {
        justify-content: left;
        gap: 2rem;
        margin: 2rem;
        padding: 2rem;
        background-color: var(--primary-dark);
        border: 0.2rem solid var(--secondary-dark);

        overflow-x: scroll;

        border-radius: 2rem;

        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;

        scroll-behavior: smooth;
    }

    #user-recipes::-webkit-scrollbar {
        height: 0.5rem;
    }

    #user-recipes::-webkit-scrollbar-thumb {
        background: var(--secondary-dark);
        border-radius: 1rem;
    }

    #user-recipes::-webkit-scrollbar-track {
        background: var(--primary-dark);
        border-radius: 1rem;
    }

    #user-recipes a {
        text-decoration: none;
    }

    .recipe-card {
        min-width: 20rem;

        width: 20rem;
        height: 25rem;
        border: 1px solid var(--tertiary);
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;

        align-items: center;
        justify-content: center;
        text-align: center;
        background-color: var(--primary);
        transition: transform 0.2s;
    }

    @media only screen and (max-width: 800px) {
        .home-container {
            width: 100%;
            min-width: unset;
            margin: 0;
        }

        h1 {
            text-align: center;
        }
    }

    @media only screen and (max-width: 500px) {
        .home-container {
            padding: 0;
        }

        #user-recipes {
            margin: 0;
            border: none;
            border-radius: 0;
        }
    }
</style>