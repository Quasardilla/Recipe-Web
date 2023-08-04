<script>
    import { onMount } from "svelte";
    let scripts = require('../sharedScripts.js')

    onMount(async () => {
    });

    //IIFE to run as soon as it's defined, not waiting for page to load
    (() => {
        scripts.protectedRequest('https://kitchen.quasardilla.com/api/tokens/', 'GET')
    })()
</script>

<main>
    <h1>Home!!</h1>
</main>

<style>
    
</style>