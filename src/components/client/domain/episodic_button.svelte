<script lang="ts">
    import * as Episodic from "../../../descriptors/public/episodic";
    import * as Fetchers from "../../../fetchers";
    import Loading from "../loading.svelte";

    import {current} from "../page.ts";

    import PageLink from "../page_link.svelte";

    export let record: Episodic.RedactableRecordEntry;
    export let prev_neighbor: Episodic.RedactableRecordEntry | undefined = undefined;

    export let preview_line_index: number | undefined = undefined;
    export let preview_matched_text: string | undefined = undefined;

    function truncate_preview_text(contents: string) {
        const max_context = 40;

        if (!preview_matched_text) {
            return contents;
        }

        const text_parts = contents.split(preview_matched_text);
        if (text_parts[0]?.length > max_context) {
            const truncated = `...${text_parts[0].substring(text_parts[0].length - max_context, text_parts[0].length)}`;
            text_parts[0] = truncated;
        }

        const last = text_parts.length - 1;
        if (text_parts[last]?.length > max_context) {
            const truncated = `${text_parts[last].substring(0, max_context)}...`;
            text_parts[last] = truncated;
        }

        let middle_parts = text_parts.slice(1, text_parts.length - 2);
        middle_parts.map(part => {
            if (part.length <= max_context) {
                return part;
            }

            const truncated = `${part.substring(0, max_context / 2)}...${part.substring(part.length - max_context, part.length)}`;
            return truncated;
        });

        const rejoined_text = [text_parts[0], ...middle_parts, text_parts[last]].join(preview_matched_text);
        return rejoined_text;
    }

    function should_show_chapter(record: Episodic.RedactableRecordEntry, prev?: Episodic.RedactableRecordEntry) {
        return !prev || prev.chapter !== record.chapter;
    }
</script>

{#if should_show_chapter(record, prev_neighbor)}
    <h3 class="chapter-name">{record.chapter}</h3>
{/if}
<div class="episodic-button" style:border-color={Episodic.get_iteration_color(record.iteration)} class:selected={$current.domain === "episodic" && $current.record_name === record.name}>
    {#if !record.name}
        <h4 class="unsolved"><em>???</em></h4>
    {:else}
        <PageLink dest={{domain: "episodic", record_name: record.name, line_index: preview_line_index}} cause_layout_switch>
            <h4 class="record-name">
                <img class="iteration-sigil" src={`/assets/images/common/iteration-${record.iteration}.png`} /> {record.title}
            </h4>
            {#if preview_line_index !== undefined}
                <p class="line-preview">
                    {#await Fetchers.get.record_text({name: record.name})}
                        <Loading />
                    {:then text} 
                        {truncate_preview_text(text.lines[preview_line_index].text)}
                    {/await}
                </p>
            {/if}
        </PageLink>
    {/if}
</div>

<style>
    .unsolved {
        color: rgba(255 255 255 / 50%);
    }

    .episodic-button {
        border-right: 3px solid rgba(255 255 255 / 50%);
        transition: background-color 0.2s ease-out;
    }

    .episodic-button:hover {
        background-color: rgba(255 255 255 / 50%);
    }

    .selected {
        background-color: rgba(255 255 255 / 25%);
    }

    .iteration-sigil {
        position: relative;
        top: 5px;
        width: 16px;
        filter: grayscale(100%) brightness(200%);
    }

    .record-name {
        width: 100%;
    }

    .chapter-name {
        text-align: right;
        border-bottom: 1px solid rgba(255 255 255 / 50%);
    }

    .line-preview {
        font-size: 0.8em;
    }

    * {
        padding: 0;
        margin: 0;
    }
</style>