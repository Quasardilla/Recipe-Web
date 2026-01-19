<script>
    import Router from 'svelte-spa-router'

    import Navbar from './modules/Navbar.svelte'

    /* Unauthenticated Website */
    import landing from './views/Landing.svelte'
    import faqTags from './views/faq/Tags.svelte'

    /* User Stuff */
    import login from './views/profile/Login.svelte'
    import home from './views/home/Home.svelte'
    import recipes from './views/home/Recipes.svelte'

    /* Recipe Pages */
    import createRecipe from './views/recipe/CreateRecipe.svelte'
    import editRecipe from './views/recipe/EditRecipe.svelte'
    import recipe from './views/recipe/Recipe.svelte'
    
</script>

<main style="width: 100%; height: 100%;">
    <Navbar></Navbar>

    <Router routes ={{
        '/' : landing,
        '/home' : home,
        '/home/recipes' : recipes,
        '/auth/user/login' : login,
        '/recipe/create' : createRecipe,
        '/recipe/:recipeUUID' : recipe,
        '/recipe/edit/:recipeUUID' : editRecipe,
        '/faq/tags' : faqTags,
    }}/>
</main>