<script lang="ts">
    import {marked} from 'marked';

    import * as Episodic from "../../../descriptors/episodic";
    import * as Fetchers from "../../../fetchers";

    import Loading from "../loading.svelte";
    import Keynav from './keynav.svelte';

    export let name: string | undefined;

    $: image_promise = Fetchers.get.single_image({name});

    function format_date(image: Awaited<typeof image_promise>) {
        const date = new Date(image.date);
        const formatted_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return formatted_date;
    }

    function format_subtitle(image: Awaited<typeof image_promise>) {
        const parts: Array<string> = [];

        const iteration_symbol = Episodic.get_iteration_sigil(image.canon ?? "");
        if (iteration_symbol) {
            parts.push(`<span style="color: ${Episodic.get_iteration_color(image.canon ?? "")}">${iteration_symbol}</span>`);
        }

        parts.push(format_date(image));

        if (image.speedpaint_video_id) {
            parts.push(`<a href="https://www.youtube.com/watch?v=${image.speedpaint_video_id}">speedpaint</a>`);
        }

        const subtitle = parts.join(" · ");
        return subtitle;
    }
</script>

<div class="container">
    {#await image_promise}
        <Loading />
    {:then image}
        <div class="image-info-container">
            <div class="image-title-container">
                <h1 class="title">{image.title}<span class="title-ordinal">#{image.ordinal}</span></h1>
                <h2 class="subtitle">{@html format_subtitle(image)}</h2>
            </div>
            <div class="image-description-container">
                {@html marked.parse(image.description)}
            </div>
        </div>
        <div class="image-container">
            <a href={image.image_url}><img src={image.image_url}></a>
        </div>
    {/await}
</div>

<style>
    .container {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: stretch;
        align-content: stretch;
        max-height: 100%;
        height: 100%;
        max-width: 100%;
    }

    .container > * {
        margin: 20px;
    }

    .image-info-container {
        display: flex;
        flex-flow: column nowrap;
        color: white;
        border-right: 2px solid rgba(255 255 255 / 50%);
        max-width: 30%;
        width: 100%;
        height: 90%;
        overflow-y: scroll;
        scrollbar-width: none;
        padding: 10px;
    }

    .image-info-container :global(a) {
        text-decoration: underline;
    }

    .image-title-container {
        display: flex;
        flex-flow: column nowrap;
        padding-bottom: 8px;
    }

    .image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        max-height: 100%;
        height: 100%;
        margin: 0;
    }

    .image-container a {
        display: flex;
        justify-content: center;
        align-items: center;
        max-height: 100%;
        height: 100%;
        max-width: 100%;
        width: 100%;
        padding-right: 15px;
    }
    
    .image-description-container {
        border-top: 2px solid rgba(255 255 255 / 50%);
        padding-top: 8px;
    }

    .image-description-container :global(*) {
        font-family: "eczar";
    }

    img {
        max-height: 95%;
        max-width: 100%;
        filter: drop-shadow(0 0 10px black);
        border-radius: 5px;
    }

    h1, h2 {
        display: block;
        margin: 0;
        padding: 0;
    }

    .title {
        font-family: "eczar";
    }

    .title-ordinal {
        font-size: 16px;
        color: rgba(255 255 255 / 75%);
        position: relative;
        bottom: 12px; 
        left: 5px;
    }

    .subtitle {
        font-size: 16px;
    }

    .image-info-container :global(code) {
        font-family: "lekton";
        font-weight: 900;
    }
</style>
