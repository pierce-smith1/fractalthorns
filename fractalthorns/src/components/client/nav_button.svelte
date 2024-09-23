<script lang="ts">
    import * as PrivateDomain from "../../helpers/domain.ts";
    import * as Fetchers from "../../fetchers";

    import {current} from "./page.ts";
    import {nav_state} from "./nav.ts";

    import PageLink from "./page_link.svelte";
    import Loading from "./loading.svelte";
    import Tooltip from "./style/tooltip.svelte";

    export let domain: PrivateDomain.Page["domain"];
    export let minor: boolean = false;

    const destination_promise: Promise<PrivateDomain.Page> = (async () => {
        switch (domain) {
            case "home": return {domain};
            case "image": {
                const latest_image = await Fetchers.get.single_image({});
                return {domain, name: latest_image.name};
            } case "sketch": {
                const all_sketches = await Fetchers.get.all_sketches({});
                const latest_sketch = all_sketches.sketches[0];
                return {domain, name: latest_sketch.name};
            } case "episodic": {
                const episodic = await Fetchers.get.full_episodic({});
                return {domain, record_name: episodic.chapters[0].records[0].name!};
            } case "subproject": return {domain};
        }
    })();

    const tooltip_text = (() => {
        switch (domain) {
            case "home": return "home";
            case "image": return "art";
            case "sketch": return "sketches";
            case "episodic": return "story";
            case "subproject": return "other";
        }
    })();

    function hide_search() {
        $nav_state = {...$nav_state, 
            search_term: "",
            viewing_search_results: false,
        };
    }

    function on_click() {
        hide_search();
    }

    $: selected = $current?.domain === domain;
</script>

{#await destination_promise}
    <Loading />
{:then destination}
    <div class="domain-button-container">
        <PageLink dest={destination}>
            <Tooltip text={tooltip_text} --color={selected ? "black" : "white"} --background={selected ? "white" : "black"} --font-size={minor ? "0.8rem" : "1rem"}>
                <button type="button" class="domain-button" class:selected class:minor on:click={on_click}>
                    <div class="button-background" style:background-image={`url(/assets/images/common/${domain}-button.png)`}></div> 
                </button>
            </Tooltip>
        </PageLink>
    </div>
{/await}

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