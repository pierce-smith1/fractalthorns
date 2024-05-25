<script lang="ts">
    import * as Fetchers from "../../../fetchers";
    import * as Image from "../../../descriptors/image";
    import * as Episodic from "../../../descriptors/episodic";

    import Loading from "../loading.svelte";
    import ImageButton from "./image_button.svelte";
    import IterationFilterButtons from "./iteration-filter-buttons.svelte";

    export let images: Array<Image.ClientModel> | undefined = undefined;

    let load_promise = images ?
        Promise.resolve(images)
        : Fetchers.get.all_images({});

    let selected_iterations: Set<Episodic.Iteration> = new Set();
</script>

<IterationFilterButtons bind:selected_iterations={selected_iterations} />
<div class="images-container">
    {#await load_promise}
        <Loading/>
    {:then images}
        {#each images as image}
            {#if selected_iterations.size === 0 || selected_iterations.has(image.canon)}
                <ImageButton {image} />
            {/if}
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