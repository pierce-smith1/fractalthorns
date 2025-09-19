<script lang="ts">
    import {marked} from "marked"

    import * as Page from "../page.svelte.ts"
    import * as Fetchers from "../../../fetchers"
    import * as Nav from "../nav.svelte.ts"
    import * as Api from "../../../api/api"

    import Keynav from './keynav.svelte';

    const no_description_placeholder = "🛠 *something indistinct echoes from the future...* 🛠";

    let props: {
        image: Api.ImageObject,
        description?: string,
    } = $props();

    let full_image_view = $state(false);

    function format_subtitle(image: Api.ImageObject) {
        const parts: Array<string> = [];

        if (image.canon) {
            parts.push(`<img class="iteration-sigil" src=/assets/images/common/iteration-${image.canon}.png />`);
        }

        parts.push(image.date);

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
        Nav.execute_search(Nav.state, character);

        if (Page.state.layout !== "full") {
            Page.state.layout = "only-nav";
        }
    }

    function toggle_full_view() {
        full_image_view = !full_image_view;
    }
</script>

<div class="container">
    <div class="smallscreen-image-container">
        <img src={props.image.image_url}>
    </div>
    <div class="image-info-container" class:fullview={full_image_view} use:setup_scroll_hint_observer>
        <div class="image-title-container">
            <div class="title-container">
                <h1 class="title">{props.image.title}<span class="title-ordinal">#{props.image.ordinal}</span></h1>
                {#if props.image.characters}
                    <div class="characters">
                        {#each props.image.characters as character}
                            <button class="character-button" type="button" onclick={() => execute_character_search(character)}>
                                <img class="runeword" src={`/serve/runeword/${character}`} alt={character}>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
            <h2 class="subtitle">{@html format_subtitle(props.image)}</h2>
        </div>
        <div class="image-description-container">
            {@html marked.parse(props.description ?? no_description_placeholder)}
            <div class="scroll-marker"></div>
        </div>
        <div class="scroll-hint">...</div>
        {#if props.image.remarks}
            <div class="remarks-container" class:fullview={full_image_view}>
                {@html marked.parse(props.image.remarks)}
            </div>
        {/if}
    </div>
    <div class="image-container" class:fullview={full_image_view}>
        <button type="button" class="image-link" onclick={toggle_full_view}>
            <img src={props.image.image_url}>
        </button>
    </div>
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
        justify-content: space-between;
        align-items: stretch;
        max-width: 100%;
        height: 100%;
    }

    .container > * {
        margin: 0;
    }

    .image-info-container {
        display: flex;
        flex-flow: column nowrap;
        position: relative;
        color: white;
        border-right: 2px solid rgba(255 255 255 / 50%);
        overflow: hidden;
        padding: 40px;
        max-width: 40%;
        min-width: 40%;
        transition: max-width 0.1s ease-out, min-width 0.1s ease-out, opacity 0.1s ease-out, padding 0.1s ease-out;
        border-bottom-left-radius: 5px;
    }

    .image-info-container.fullview {
        max-width: 0%;
        min-width: 0%;
        opacity: 0;
        padding: 0;
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
        flex-flow: column nowrap;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        max-height: 100%;
        margin: 0;
        padding: 0 20px 0 20px;
        transition: width 0.1s ease-out, padding 0.1s ease-out;
    }

    .image-container.fullview {
        width: 100%;
        padding: 0;
    }

    .smallscreen-image-container {
        display: none;
    }

    .image-link {
        display: flex;
        justify-content: center;
        align-items: center;
        max-height: 100%;
        width: 100%;
        background: none;
        border: none;
        transition: background 0.2s ease-out;
    }

    .image-link:hover {
        background: rgba(255 255 255 / 20%);
    }

    .image-description-container {
        border-top: 2px solid rgba(255 255 255 / 50%);
        overflow-y: auto;
        flex-grow: 2;
        scrollbar-width: none;
    }

    .image-description-container :global(*) {
        font-family: "eczar";
        font-size: 1em;
    }

    .image-description-container :global(pre) {
        white-space: pre-wrap;
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
    
    .title-container {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
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

    .runeword {
        color: black;
        max-width: 14px;
        filter: invert();
        opacity: 50%;
        transition: opacity 0.2s ease-out;
    }
    
    .runeword:hover {
        opacity: 80%;
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

    .remarks-container {
        width: 100%;
        color: white;
        border-top: 2px solid rgba(255 255 255 / 50%);
        line-height: 0.2em;
        transition: height 0.1s ease-out
    }

    .remarks-container :global(a) {
        color: white;
        text-decoration: underline;
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
