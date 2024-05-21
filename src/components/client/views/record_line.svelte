<script lang="ts">
    import {marked} from 'marked';

    import * as Record from "../../../descriptors/record";

    export let record: Record.Model;
    export let line: Record.LineModel;
    export let last_line: Record.LineModel | undefined = undefined;

    const should_show_speaker = line.character 
        && line.character !== Record.narrator_character
        && line.character !== last_line?.character;

    const is_continuation_line = last_line?.type === "Inline"
        && line.type === "Inline"
        && line.character === last_line?.character;

    const should_show_language = line.language 
        && line.language !== last_line?.language
        && line.character !== Record.narrator_character;
</script>

<div class="record-line-container" class:continuation={is_continuation_line}>
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
    <div class="line-content-container">
        {#if line.type === "Sabre"}
            <p>&lt; {line.text} &gt;</p>
        {:else}
            {@html marked.parse(line.text, {breaks: record.options?.fmt === "poem"})}
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
    }

    .line-content-container {
        min-width: 80%;
        width: 80%;
        max-width: 80%;
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
    }
</style>