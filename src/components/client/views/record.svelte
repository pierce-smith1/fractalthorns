<script lang="ts">
    import * as Fetchers from "../../../fetchers";
    import * as RecordDeco from "./graphics/record_deco";
    import * as Api from "../../../api/api";

    import Loading from '../loading.svelte';
    import Keynav from "./keynav.svelte";
    import RecordLine from "./record_line.svelte";
    import Canvas from "../../canvas/canvas.svelte";

    let {
        record,
        text,
        line_index = undefined,
    }: {
        record: Api.RedactableRecordEntry,
        text: Api.RecordTextResponse,
        line_index?: number,
    } = $props();

    const style = RecordDeco.get_style(record);

    let container_element: HTMLElement;
    let deco_element: HTMLElement;

    $effect(() => {
        if (deco_element) {
            deco_element.style.setProperty('--accent-color', RecordDeco.get_style(record).accent_color);
            container_element.style.setProperty('--accent-color', RecordDeco.get_style(record).accent_color);

            deco_element.style.setProperty('--gutter-size', `${RecordDeco.size}px`);
            container_element.style.setProperty('--gutter-size', `${RecordDeco.size}px`);
        }
    });

    let gutter_deco_artist = new RecordDeco.GutterDecoArtist(style);
</script>

<div class="view-container">
    <div class="gutter-deco-container" bind:this={deco_element}>
        <div class="gutter-deco-canvas">
            <Canvas artist={gutter_deco_artist} />
        </div>
    </div>
    <div class="record-container" bind:this={container_element}>
        <div class={`record-text-container iter-${record.iteration} record-${record.name}`}>
            <div class="record-title-container">
                <h1 class="record-title">
                    <span class="title-chapter">{record.chapter}</span>&nbsp;{record.title}
                </h1>
            </div>
            <pre class="record-header">{text.header_lines.join("\n")}</pre>
            <div class="record-body-container">
                {#each text.lines as line, i}
                    <RecordLine 
                        {line} 
                        last_line={i > 0 ? text.lines[i - 1] : undefined} 
                        record={text} 
                        line_index={i} 
                        requested_line_index={line_index}
                    />
                {/each}
            </div>
        </div>
    </div>
</div>
{#await Fetchers.get.single_image({name: undefined})}
    <Loading />
{:then image}
    <Keynav
        page_left={{domain: "image", name: image.name}}
        page_right={{domain: "subproject"}}
    />
{/await}

<style>
    .view-container {
        display: flex;
        flex-flow: row-reverse nowrap;
        height: 100%;
        overflow-y: scroll;
    }

    .record-container {
        width: calc(100% - var(--gutter-size));
        display: flex;
        justify-content: center;
        align-items: center;
        height: fit-content;
        color: rgba(from var(--accent-color) calc(r / 5) calc(g / 5) calc(b / 5));
    }

    .record-container:has(.iter-0) {
        background-color: black;
        color: rgba(255 255 255 / 60%);
    }

    .record-container:has(.record-repentance) {
        background-color: rgba(from #a1a4b7 r g b / 80%);
        color: #2c2d32;
    }

    .record-container:has(.record-somehow-i-knew) {
        background-color: rgba(from #f6a9c8 r g b / 50%);
    }
    
    .record-title-container {
        position: relative;
        padding: 20px;
    }

    .record-title {
        font-family: "saira";
        line-height: 1em;
        font-size: 4.5vw;
    }

    .title-chapter {
        position: absolute;
        text-align: right;
        top: 1rem;
        transform: translateX(-100%);
        font-size: 2vw;
        color: rgba(from var(--accent-color) calc(r / 2) calc(g / 2) calc(b / 2));
    }

    .record-text-container {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        width: 50%;
        height: 100%;
    }

    .record-header {
        width: 100%;
        text-align: center;
        padding-bottom: 13px;
        border-bottom: 2px solid rgba(from var(--accent-color) calc(r / 2) calc(g / 2) calc(b / 2) / 30%);
    }

    .record-body-container {
        position: relative;
        width: 100%;
        margin-left: 100px;
        display: flex;
        flex-flow: column nowrap;
        padding-bottom: 100px;
    }

    .gutter-deco-container {
        position: fixed;
        left: 0;
        top: 0;
        min-width: var(--gutter-size);
        max-width: var(--gutter-size);
    }

    h1 {
        font-size: 3rem;
        padding: 30px 0 30px 0;
        margin: 0;
        line-height: 70px;
        text-align: center;
    }

    :global(code) {
        color: lch(from var(--accent-color) calc(l - 30) c h);
    }

    :global(.line-content-container img) {
        display: block;
        margin: auto;
        padding: 30px 0;
    }

    @media (width <= 1200px) {
        .record-container {
            width: 100%;
        }

        .record-header {
            font-size: 2.2vw;
        }

        .record-body-container {
            margin-left: 0;
        }

        .record-text-container {
            width: 100%;
        }

        .gutter-deco-container {
            display: none;
        }
    }
</style>
