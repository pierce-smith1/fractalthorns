<script lang="ts">
    import * as Episodic from "../../../descriptors/episodic";

    import PageLink from "../page_link.svelte";

    export let record: Episodic.RedactableRecordEntry;
</script>

<div class="episodic-button">
    {#if !record.name}
        <h4 class="unsolved"><em>???</em></h4>
    {:else}
        <PageLink dest={({domain: "episodic", item: record.name})}>
            <h4 class="record-name" style:border-color={Episodic.get_iteration_color(record.iteration)}>
                {Episodic.get_iteration_sigil(record.iteration)} {record.title}
            </h4>
        </PageLink>
    {/if}
</div>

<style>
    .unsolved {
        color: rgba(255 255 255 / 50%);
    }

    .record-name {
        width: 100%;
        border-right: 3px solid rgba(255 255 255 / 50%);
    }

    .record-name:hover {
        background-color: rgba(255 255 255 / 25%);
    }

    * {
        padding: 0;
        margin: 0;
    }
</style>