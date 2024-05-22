<script lang="ts">
    import * as Fetchers from "../../../fetchers";

    import Loading from "../loading.svelte";
    import ImageButton from "./image_button.svelte";

    let load_promise = Fetchers.get.all_images({});
</script>

<div class="images-container">
    {#await load_promise}
        <Loading/>
    {:then images}
        {#each images as image}
            <ImageButton {image} />
        {/each}
    {/await}
</div>

<style>
    .images-container {
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
        width: 90%;
        padding: 10px;
        gap: 5px;
    }
</style>