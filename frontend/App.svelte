<script>
    import Router from 'svelte-spa-router'

    import landing from './views/landing.svelte'
    import Navbar from './modules/navbar.svelte'
    import login from './views/login.svelte'

</script>

<main style="width: 100%; height: 100%;">
    <Navbar />

    <Router routes ={{
        '/' : landing,
        '/auth/user/login' : login,
    }}/>
</main>