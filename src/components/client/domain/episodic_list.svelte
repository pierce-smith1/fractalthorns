<script lang="ts">
    import * as Fetchers from "../../../fetchers";

    import Loading from "../loading.svelte";
    import EpisodicButton from "./episodic_button.svelte";

    let load_promise = Fetchers.get.full_episodic({});
</script>

<div class="episodic-container">
    {#await load_promise}
        <Loading />
    {:then episodic}
        {#each episodic as chapter}
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