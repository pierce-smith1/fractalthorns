<script lang="ts">
    import * as Fetchers from "../../../fetchers";
    import * as Image from "../../../descriptors/image";

    import Loading from "../loading.svelte";
    import ImageButton from "./image_button.svelte";

    export let images: Array<Image.ClientModel> | undefined = undefined;

    let load_promise = images ?
        Promise.resolve(images)
        : Fetchers.get.all_images({});
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
        width: 90%;
        padding: 10px;
        gap: 5px;
    }
</style>