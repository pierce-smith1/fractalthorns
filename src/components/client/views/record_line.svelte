<script lang="ts">
    import {marked} from "marked";
    import {onMount} from "svelte";

    import * as Api from "../../../api";
    import * as RecordHelpers from "../../../helpers/record";

    export let record: Api.RecordTextResponse;
    export let line: Api.RecordLine;
    export let last_line: Api.RecordLine | undefined = undefined;
    export let line_index: number;
    export let requested_line_index: number | undefined;

    const should_show_speaker = line.character 
        && line.character !== RecordHelpers.narrator_character
        && line.character !== last_line?.character;

    const is_continuation_line = last_line?.type === "Inline"
        && line.type === "Inline"
        && line.character === last_line?.character;

    const should_show_language = line.language 
        && line.language !== last_line?.language
        && line.character !== RecordHelpers.narrator_character
        && last_line?.type !== "Sabre";

    function emphasize_keywords(text: string): string {
        let emphasized_text = text;

        for (const keyword of RecordHelpers.mnemonic_keywords) {
            emphasized_text = emphasized_text.replaceAll(keyword, `\`${keyword}\``);
        }

        return emphasized_text;
    }

    onMount(() => {
        if (requested_line_index === line_index) {
            document.querySelector(`#line_${line_index}`)?.scrollIntoView();
        }
    });

    $: if (requested_line_index === line_index) {
        document.querySelector(`#line_${line_index}`)?.scrollIntoView();
    }
</script>

<div class="record-line-container" id={`line_${line_index}`} class:continuation={is_continuation_line}>
    {#if should_show_speaker || line.emphasis || should_show_language}
        <div class="speaker-gutter">
            {#if should_show_speaker}
                <span class="speaker">{line.character}</span>
            {/if}
            {#if line.emphasis}
                <span class="emphasis">({line.emphasis})</span>
            {/if}
            {#if should_show_language}
                <span class="language"><em>(in {line.language?.toUpperCase()})</em></span>
            {/if}
        </div>
    {/if}
    <div class="line-content-container" class:highlighted={requested_line_index === line_index}>
        {#if line.type === "Sabre"}
            <code>&lt; {line.text} &gt;</code>
        {:else}
            {@html marked.parse(emphasize_keywords(line.text), {breaks: record?.format === "poem"})}
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
        font-size: 1.1em;
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
        font-family: "eczar";
        font-size: 1.15rem;
    }

    .line-content-container :global(p) {
        margin: 0;
        padding: 0;
    }

    .line-content-container :global(code) {
        font-family: "lekton";
        font-weight: 900;
    }

    .highlighted {
        font-weight: 600;
    }

    @media (width <= 1200px) {
        .record-line-container {
            flex-flow: column nowrap;
        }

        .speaker-gutter {
            position: relative;
            flex-flow: row nowrap;
            left: 0;
            margin-left: 30px;
            min-width: 0;
            max-width: 90%;
            width: 90%;
            text-align: left;
            color: rgba(0 0 0 / 60%);
            font-weight: 900;
            padding-bottom: 16px;
        }

        .line-content-container {
            border-left: none;
            padding-top: 0;
        }


    }
</style>