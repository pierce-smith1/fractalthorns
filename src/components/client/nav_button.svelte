<script lang="ts">
    import * as PrivateDomain from "../../helpers/domain.ts";

    import * as Page from "./page.svelte.ts";
    import * as Nav from "./nav.svelte.ts";

    import PageLink from "./page_link.svelte";
    import Tooltip from "./style/tooltip.svelte";

    let {domain, minor = false}: {
        domain: PrivateDomain.Page["domain"],
        minor?: boolean,
    } = $props();

    let selected = $derived(Page.state.current.domain === domain);
    let tooltip_text = $derived({
        "home": "home",
        "image": "art",
        "sketch": "sketches",
        "episodic": "story",
        "discover": "discovery",
        "subproject": "other",
    }[domain]);

    function hide_search() {
        Nav.clear_search();
    }
</script>

<div class="domain-button-container">
    <PageLink dest={{domain}}>
        <Tooltip
            text={tooltip_text}
            --color={selected ? "black" : "white"}
            --background={selected ? "white" : "black"}
            --font-size={minor ? "0.8rem" : "1rem"}
        >
            <button type="button" class="domain-button" class:selected class:minor onclick={hide_search}>
                <div class="button-background" style:background-image={`url(/assets/images/common/${domain}-button.png)`}></div> 
            </button>
        </Tooltip>
    </PageLink>
</div>

<style>
    .domain-button {
        width: 48px;
        max-width: 48px;
        height: 48px;
        max-height: 48px;
        border: none;
        background-color: rgba(0 0 0 / 75%);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 0;
    }

    .button-background {
        background-position: center;
        width: 100%;
        height: 100%;
    }

    .selected {
        color: black;
        background-color: white;
    }

    .minor {
        max-width: 36px;
        max-height: 36px;
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
