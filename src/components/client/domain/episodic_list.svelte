<script lang="ts">
    import * as Fetchers from "../../../fetchers";
    import * as Episodic from "../../../descriptors/episodic";

    import Loading from "../loading.svelte";
    import EpisodicButton from "./episodic_button.svelte";
    import IterationFilterButtons from "./iteration-filter-buttons.svelte";

    export let records: Episodic.ClientModel | undefined = undefined;

    let load_promise = records ?
        Promise.resolve(records)
        : Fetchers.get.full_episodic({});

    $: selected_iterations = new Set<Episodic.Iteration>();

    function filter_episodic(episodic: Episodic.ClientModel, selected: Set<Episodic.Iteration>): Episodic.ClientModel {
        const filtered_records = episodic
            .map(chapter => ({name: chapter.name, records: chapter.records.filter(record => selected.size === 0 || selected.has(record.iteration))}))
            .filter(chapter => chapter.records.length > 0);

        return filtered_records;
    }
</script>

<IterationFilterButtons bind:selected_iterations={selected_iterations} />
<div class="episodic-container">
    {#await load_promise}
        <Loading />
    {:then episodic}
        {#each filter_episodic(episodic, selected_iterations) as chapter}
            <div class="chapter-container">
                <h3 class="chapter-name">{chapter.name}</h3>
                {#each chapter.records as record}
                    <EpisodicButton {record} />
                {/each}
            </div>
        {/each}
    {/await}
</div>

<style>
    .episodic-container {
        width: 90%;
        padding: 10px;
    }
    
    .episodic-container * {
        padding: 0;
        margin: 0;
    }

    .chapter-name {
        width: 100%;
        margin: 10px 0 10px 0;
        text-align: right;
        border-bottom: 1px solid rgba(255 255 255 / 50%);
    }
</style>