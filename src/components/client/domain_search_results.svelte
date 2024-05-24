<script lang="ts">
    import * as Fetchers from "../../fetchers";
    import * as Domain from "../../descriptors/domain";

    import Loading from "./loading.svelte";
    import EpisodicButton from "./domain/episodic_button.svelte";
    import ImagesList from "./domain/images_list.svelte";

    export let results: Domain.HolisticSearchResults;

    $: image_promises = results["image"].then(images => Promise.all(images
        .map(result => Fetchers.get.single_image({name: result.name}))));

    $: episodic_item_promises = results["episodic-item"].then(results => Promise.all(results
        .map(result => Fetchers.get.single_record({name: result.record_name!}))));

    $: episodic_line_promises = results["episodic-line"].then(results => Promise.all(results
        .map(result => Fetchers.get.single_record({name: result.record_name!}))));

    $: episodic_line_results_promises = results["episodic-line"].then(results => Promise.all(results));
</script>

<div class="search-results">
    <div class="results">
        {#await image_promises}
            <Loading />
        {:then images}
            {#if images.length > 0}
                <div class="domain-header"><h3>images</h3></div>
            {/if}
            <ImagesList {images} />
        {/await}
    </div>

    <div class="results">
        {#await episodic_item_promises}
            <Loading />
        {:then records}
            {#if records.length > 0}
                <div class="domain-header"><h3>records</h3></div>
            {/if}
            {#each records as record, i}
                <EpisodicButton {record} />
            {/each}
        {/await}
    </div>

    <div class="results">
        {#await Promise.all([episodic_line_promises, episodic_line_results_promises])}
            <Loading />
        {:then [records, results]}
            {#if records.length > 0}
                <div class="domain-header"><h3>text search</h3></div>
            {/if}
            {#each records as record, i}
                <EpisodicButton {record} preview_line_index={results[i].line_index} preview_matched_text={results[i].matched_text} />
            {/each}
        {/await}
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
        width: 100%;
        padding: 10px;
    }

    .results {
        width: 90%;
        margin: auto;
        padding-bottom: 20px;
    }
</style>