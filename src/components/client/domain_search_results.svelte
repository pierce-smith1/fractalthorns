<script lang="ts">
    import * as Fetchers from "../../fetchers";
    import * as Domain from "../../descriptors/domain";

    import ImageButton from "./domain/image_button.svelte";
    import Loading from "./loading.svelte";
    import EpisodicButton from "./domain/episodic_button.svelte";

    export let results: Array<Domain.Page>;

    const image_promises = results
        .filter(result => result.domain === "image")
        .map(result => Fetchers.get.single_image({name: result.item}));

    const episodic_promises = results
        .filter(result => result.domain === "episodic")
        .map(result => Fetchers.get.single_record({name: result.item!}));
</script>

<div class="search-results">
    {#if image_promises.length > 0}
        <div class="domain-header"><h3>i</h3></div>
    {/if}
    {#each image_promises as promise}
        {#await promise}
            <Loading />
        {:then image} 
            <ImageButton {image} />
        {/await}
    {/each}

    {#if episodic_promises.length > 0}
        <div class="domain-header"><h3>e</h3></div>
    {/if}
    <div class="episodic-results">
        {#each episodic_promises as promise}
            {#await promise}
                <Loading />
            {:then record} 
                <EpisodicButton {record} />
            {/await}
        {/each}
    </div>
</div>

<style>
    .domain-header {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding-bottom: 10px;
    }

    .domain-header h3 {
        width: 90%;
        padding: 0;
        margin: 0;
        border-bottom: 1px solid rgba(255 255 255 / 50%);
    }

    .search-results {
        width: 90%;
        padding: 10px;
    }

    .episodic-results {
        width: 100%;
    }
</style>