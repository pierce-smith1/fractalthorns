<script lang="ts">
    import * as Fetchers from "../../fetchers";
    import * as Domain from "../../descriptors/domain";

    import ImageButton from "./domain/image_button.svelte";
    import Loading from "./loading.svelte";
    import EpisodicButton from "./domain/episodic_button.svelte";
    import ImagesList from "./domain/images_list.svelte";

    export let results: Array<Domain.PageSearchResult>;

    const image_promises = results
        .filter(function(result): result is Extract<Domain.PageSearchResult, {domain: "image"}> { return result.domain === "image"; })
        .map(result => Fetchers.get.single_image({name: result.name}));

    const episodic_promises = results
        .filter(function(result): result is Extract<Domain.PageSearchResult, {domain: "episodic"}> { return result.domain === "episodic"; })
        .map(result => [Fetchers.get.single_record({name: result.record_name!}), result] as const);
</script>

<div class="search-results">
    {#if image_promises.length > 0}
        <div class="domain-header"><h3>images</h3></div>
    {/if}
    {#await Promise.all(image_promises)}
        <Loading />
    {:then images}
        <ImagesList {images} />
    {/await}

    {#if episodic_promises.length > 0}
        <div class="domain-header"><h3>records</h3></div>
    {/if}
    <div class="episodic-results">
        {#each episodic_promises as [promise, result]}
            {#await promise}
                <Loading />
            {:then record} 
                <EpisodicButton {record} preview_line_index={result.line_index} preview_matched_text={result.matched_text} />
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