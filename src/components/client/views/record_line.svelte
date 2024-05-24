<script lang="ts">
    import {marked} from "marked";
    import {onMount} from "svelte";

    import * as Record from "../../../descriptors/record";
    import * as Episodic from "../../../descriptors/episodic";

    export let record: Record.Model;
    export let line: Record.LineModel;
    export let last_line: Record.LineModel | undefined = undefined;
    export let line_id: string;
    export let requested_line_id: string | undefined;

    const should_show_speaker = line.character 
        && line.character !== Record.narrator_character
        && line.character !== last_line?.character;

    const is_continuation_line = last_line?.type === "Inline"
        && line.type === "Inline"
        && line.character === last_line?.character;

    const should_show_language = line.language 
        && line.language !== last_line?.language
        && line.character !== Record.narrator_character;

    function emphasize_keywords(text: string): string {
        let emphasized_text = text;

        for (const keyword of Episodic.mnemonic_keywords) {
            emphasized_text = emphasized_text.replaceAll(keyword, `\`${keyword}\``);
        }

        return emphasized_text;
    }

    onMount(() => {
        if (requested_line_id === line_id) {
            document.querySelector(`#${line_id}`)?.scrollIntoView();
        }
    });
</script>

<div class="record-line-container" id={line_id} class:continuation={is_continuation_line}>
    <div class="speaker-gutter">
        {#if should_show_speaker}
            <span class="speaker">{line.character}</span>
        {/if}
        {#if line.emphasis}
            <span class="emphasis">{line.emphasis}</span>
        {/if}
        {#if should_show_language}
            <span class="language"><em>(in {line.language})</em></span>
        {/if}
    </div>
    <div class="line-content-container" class:highlighted={requested_line_id === line_id}>
        {#if line.type === "Sabre"}
            <p>&lt; {line.text} &gt;</p>
        {:else}
            {@html marked.parse(emphasize_keywords(line.text), {breaks: record.options?.fmt === "poem"})}
        {/if}
    </div>
</div>

<style>
    .record-line-container {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }

    .speaker-gutter {
        position: absolute;
        left: -500px;
        display: flex;
        flex-flow: row-reverse nowrap;
        justify-content: flex-start;
        gap: 10px;
        min-width: 500px;
        padding-top: 16px;
        font-size: 18px;
    }

    .line-content-container {
        min-width: 90%;
        width: 90%;
        max-width: 90%;
        padding: 15px 10px 0 10px;
        margin-left: 10px;
        border-left: 2px solid rgba(255 255 255 / 50%);
    }

    .continuation .line-content-container {
        padding: 5px 10px 0 10px;
    }

    .continuation .speaker-gutter {
        padding-top: 7px;
    }

    .line-content-container :global(*) {
        padding: 0;
        margin: 0;
        font-family: "eczar";
        font-size: 18px;
    }

    .line-content-container :global(code) {
        font-family: "lekton";
        font-weight: 900;
    }

    .highlighted {
        font-weight: 600;
    }
</style>