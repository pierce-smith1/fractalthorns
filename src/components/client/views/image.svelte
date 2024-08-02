<script lang="ts">
    import {marked} from "marked";

    import {layout_state} from "../page";
    import * as ImageHelpers from "../../../helpers/image";
    import * as Fetchers from "../../../fetchers";
    import * as Nav from "../nav";

    import Loading from "../loading.svelte";
    import Keynav from './keynav.svelte';

    const no_description_placeholder = "🛠 *something indistinct echoes from the future...* 🛠";

    export let name: string;

    $: image_promise = Fetchers.get.single_image({name});
    $: description_promise = Fetchers.get.image_description({name});

    function format_subtitle(image: Awaited<typeof image_promise>) {
        const parts: Array<string> = [];

        if (image.canon) {
            parts.push(`<img class="iteration-sigil" src=/assets/images/common/iteration-${image.canon}.png />`);
        }

        parts.push(ImageHelpers.get_date_string(image.date));

        if (image.speedpaint_video_url) {
            parts.push(`<a href="${image.speedpaint_video_url}">speedpaint</a>`);
        }

        const subtitle = parts.join(" · ");
        return subtitle;
    }

    function setup_scroll_hint_observer(node: HTMLElement) {
        const scroll_hint = node.querySelector<HTMLDivElement>(".scroll-hint")!;
        const scroll_marker = node.querySelector<HTMLDivElement>(".scroll-marker")!;

        const scroll_observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                scroll_hint.hidden = entry.isIntersecting;
            }
        });

        scroll_observer.observe(scroll_marker);
    }

    function execute_character_search(character: string) {
        Nav.execute_search(character);

        if ($layout_state !== "full") {
            $layout_state = "only-nav";
        }
    }
</script>

<div class="container">
    {#await image_promise}
        <Loading />
    {:then image}
        <div class="smallscreen-image-container">
            <img src={image.image_url}>
        </div>
        <div class="image-info-container" use:setup_scroll_hint_observer>
            <div class="image-title-container">
                <h1 class="title">{image.title}<span class="title-ordinal">#{image.ordinal}</span></h1>
                <h2 class="subtitle">{@html format_subtitle(image)}</h2>
                {#if image.characters}
                    <div class="characters">
                        {#each image.characters as character}
                            <button class="character-button" type="button" on:click={() => execute_character_search(character)}>{character}</button>
                        {/each}
                    </div>
                {/if}
            </div>
            <div class="image-description-container">
                {#await description_promise}
                    <Loading />
                {:then {description}} 
                    {@html marked.parse(description ?? no_description_placeholder)}
                {/await}
                <div class="scroll-marker"></div>
            </div>
            <div class="scroll-hint">...</div>
        </div>
        <div class="image-container">
            <a href={image.image_url} class="image-link"><img src={image.image_url}></a>
        </div>
    {/await}
</div>
{#await Fetchers.get.full_episodic({})}
{:then episodic}
    <Keynav
        page_left={{domain: "home"}}
        page_right={{domain: "episodic", record_name: episodic.chapters[0].records[0].name ?? ""}}
    />
{/await}

<style>
    .container {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-evenly;
        align-items: stretch;
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
        position: relative;
        color: white;
        border-right: 2px solid rgba(255 255 255 / 50%);
        max-width: 30%;
        width: 30%;
        height: 90%;
        overflow: hidden;
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
        max-width: 70%;
        margin: 0;
    }

    .smallscreen-image-container {
        display: none;
    }

    .image-link {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        padding-right: 15px;
    }

    .image-description-container {
        border-top: 2px solid rgba(255 255 255 / 50%);
        padding-top: 8px;
        overflow-y: auto;
        scrollbar-width: none;
    }

    .image-description-container :global(*) {
        font-family: "eczar";
        font-size: 1em;
    }

    .scroll-hint {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 105%;
        text-align: center;
        font-size: 1rem;
        pointer-events: none;
        padding: 10px 0 10px 0;
        background: linear-gradient(rgba(0 0 0 / 0%), rgba(0 0 0 / 75%));
        opacity: 0%;
        animation: 0.2s linear 0.3s fadein forwards;
    }

    /* TODO this animation looks nice but the real point of it is a nasty hack to 
       hide the scroll hint in that split second before the intersection observer
       sees it, since otherwise it flashes on screen like a rave for ants as you
       page through images.
       In other words, I'M NOT WEARING THIS COLOGNE FOR YOU PEOPLE,
       I'M JUST DOING IT FOR THAT BITCH AT CHURCH!!!
    */
    @keyframes fadein {
        from {
            opacity: 0%;
        }

        to {
            opacity: 100%;
        }
    }
    
    .scroll-marker {
        width: 100%;
        height: 1rem;
    }

    img {
        filter: drop-shadow(0 0 10px black);
        border-radius: 5px;
        max-height: 95%;
        max-width: 100%;
        object-fit: contain;
    }

    h1, h2 {
        display: block;
        margin: 0;
        padding: 0;
    }

    .title {
        font-family: "eczar";
        font-size: 2rem;
    }

    .title-ordinal {
        font-size: 0.4em;
        color: rgba(255 255 255 / 75%);
        position: relative;
        bottom: 12px; 
        left: 5px;
    }

    .subtitle {
        font-size: 1.2em;
    }

    .characters {
        display: flex;
        gap: 5px;
    }
    
    .character-button {
        background: none;
        border: none;
        color: rgba(255 255 255 / 50%);
        margin: 0;
        padding: 0;
        text-decoration: underline;
        cursor: pointer;
    }

    .image-info-container :global(code) {
        font-family: "lekton";
        font-weight: 900;
    }

    .image-info-container :global(.iteration-sigil) {
        position: relative;
        top: 3px;
        width: 16px;
    }

    @media (width <= 1200px) {
        .container {
            flex-flow: column nowrap;
            overflow-y: auto;
            justify-content: flex-start;
            align-items: center;
        }

        .container > * {
            margin: 0;
        }

        .smallscreen-image-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .image-info-container {
            max-width: 90%;
            width: 90%;
            border-right: none;
            height: auto;
            overflow: visible;
        }

        .image-container {
            display: none;
        }
    }
</style>
