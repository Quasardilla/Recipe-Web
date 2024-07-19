<script>
    const scripts = require('../sharedScripts.js')
    let userData;

    //IIFE to run as soon as it's defined, not waiting for page to load
    (async () => {
        let res = await scripts.protectedRequest('https://kitchen.quasardilla.com/api/tokens/', 'GET')
        userData = (await res.json()).user
    })()
</script>

<main>
    <h1>Home!!</h1>
    <p>Welcome, {userData ? userData.username : 'user'}!</p>
</main>

<style>
    
</style>