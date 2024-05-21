<script lang="ts">
    import * as Fetchers from "../../../fetchers";

    import Loading from "../loading.svelte";
    import ImageButton from "./image_button.svelte";

    let load_promise = Fetchers.get.all_images({});
</script>

<div class="container">
    {#await load_promise}
        <Loading/>
    {:then images}
        <div class="image-portraits">
        {#each images as image}
            <ImageButton {image} />
        {/each}
        </div>
    {/await}
</div>

<style>
    .container {
        display: flex;
        flex-flow: column nowrap;
        max-height: 100%;
        width: 90%;
    }

    .image-portraits {
        display: flex;
        flex-flow: column nowrap;
    }
</style>