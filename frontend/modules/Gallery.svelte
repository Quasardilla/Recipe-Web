<script>
    export let media = [];
    let images = [];

    for(let i = 0; i < media.length; i++) {
        images.push(media[i]);
    }

    let currentImg = 0;

    function loadImages() {
        
    }


    function toggleModal(imgNum) {
        let modal = document.getElementById('gallery-modal');
        modal.classList.toggle('hidden');
        currentImg = imgNum
    }

    function nextImage() {
        if(currentImg + 1 > media.length - 1)
            return;
        currentImg++;

        console.log(currentImg)
    }

    function prevImage() {
        if(currentImg - 1 < 0)
            return;
        currentImg--;

        console.log(currentImg)
    }

</script>

<div id="gallery-modal" class="hidden flex-row" on:click|self={toggleModal}>
    <button id="gallery-previous" on:click={prevImage}>stuff</button>
    <img id="main-image" src="{media[currentImg]}" on:click|self={toggleModal}>
    <button id="gallery-previous" on:click={nextImage}>stuff</button>
</div>

<div class="gallery-container flex-row">
    <img src="{images[0]}" class="{media[0] ? '' : 'hidden'}" on:click={() => {toggleModal(0)}}>
    <div class="flex-col">
        <img src="{images[1]}" class="{media[1] ? '' : 'hidden'}" on:click={() => {toggleModal(1)}}>
        <img src="{images[2]}" class="{media[2] ? '' : 'hidden'}" on:click={() => {toggleModal(2)}}>
        <div class="{media.length > 3 ? 'cover' : 'hidden'} flex-row">
            <p>
                {#if media.length > 3}
                    {media.length - 3} more
                {/if}
            </p>
        </div>
    </div>
</div>

<style>
    #gallery-modal {
        background-color: #50505099;
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
    }

    #gallery-modal:hover {
        cursor: pointer;
    }

    #gallery-modal #main-image {
        object-fit: contain;
        max-width: 100%;
        max-height: 70rem;
        width: auto;
        height: 100%;
    }

    .gallery-container {
        align-content: center;
        justify-content: center;
    }

    .gallery-container img{
        margin: 1rem;
        transition: transform 200ms ease-in-out;
    }

    .gallery-container img:hover {
        cursor: pointer;
        transform: scale(1.04);
    }

    .gallery-container>img{
        object-fit: contain;
        max-width: 65%;
        max-height: 70rem;
        width: auto;
        height: 100%;
        border-radius: 0.5rem;
    }

    .gallery-container .flex-col {
        position: relative;
        width: 35%;
    }

    .gallery-container .flex-col img {
        object-fit: cover;
        max-width: 100%;
        max-height: 35rem;
        width: auto;
        height: 100%;
        border-radius: 0.5rem;
    }

    .gallery-container .flex-col .cover {
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        right: 1rem; 
        background-color: #ccccccbb;
        z-index: 5;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
    }

    .gallery-container .flex-col .cover p {
        width: 100%;
        text-align: center;
        color: var(--primary);
    }
</style>