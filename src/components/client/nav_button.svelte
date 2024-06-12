<script lang="ts">
    import * as Domain from "../../descriptors/domain";

    import {current} from "./page.ts";
    import {nav_state} from "./nav.ts";

    import PageLink from "./page_link.svelte";

    export let domain: Domain.Page["domain"];

    function hide_search() {
        $nav_state = {...$nav_state, viewing_search_results: false};
    }

    function get_tooltip_text() {
        switch (domain) {
            case "home": return "home";
            case "image": return "images";
            case "episodic": return "story";
            case "subproject": return "other";
        }
    }
</script>

<div class="domain-button-container">
    <PageLink dest={{domain}}>
        <button data-tooltip={get_tooltip_text()} type="button" class="domain-button" class:selected={$current?.domain === domain} on:click={hide_search}>
           <div class="button-background" style:background-image={`url(/assets/images/common/${domain}-button.png)`}></div> 
        </button>
    </PageLink>
</div>

<style>
    .domain-button {
        width: 48px;
        max-width: 48px;
        height: 48px;
        max-height: 48px;
        border: 1px solid rgba(255 255 255 / 50%);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .domain-button:hover:after {
        content: attr(data-tooltip);
        position: absolute;
        top: -0.5rem;
        border: 1px solid rgba(255 255 255 / 50%);
        border-radius: 5px;
        font-size: 1rem;
        color: white;
        background: black;
        padding: 0 5px 0 5px;
    }

    .domain-button.selected:hover:after {
        color: black;
        background: white;
    }

    .button-background {
        background-size: cover;
        background-position: center;
        width: 40px;
        height: 40px;
    }

    .selected {
        color: black;
        background-color: white;
    }

    .selected .button-background {
        filter: invert();
    }
    
    .domain-button :global(a) {
        color: white;
        text-decoration: none;
    }

    button {
        background: none;
        color: white;
    }
</style>