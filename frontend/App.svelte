<script>
    import Router from 'svelte-spa-router'

    import Navbar from './modules/Navbar.svelte'
    import landing from './views/Landing.svelte'
    import login from './views/Login.svelte'
    import home from './views/Home.svelte'
    import createRecipe from './views/CreateRecipe.svelte'
    import recipe from './views/Recipe.svelte'
</script>

<main style="width: 100%; height: auto; background-color: var(--primary)">
    <Navbar />

    <Router routes ={{
        '/' : landing,
        '/home' : home,
        '/auth/user/login' : login,
        '/recipe/create' : createRecipe,
        '/recipe/:recipeUUID' : recipe,
    }}/>
</main>