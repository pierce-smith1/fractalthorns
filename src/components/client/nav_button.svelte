<script lang="ts">
    import * as Domain from "../../descriptors/domain";
    import * as Fetchers from "../../fetchers";
    import * as Subproject from "../../descriptors/subproject";

    import {current} from "./page.ts";
    import {current_items} from "./nav.ts";

    import PageLink from "./page_link.svelte";

    export let domain: Domain.Page["domain"];

    function set_items() {
        const new_items_promise: Promise<Array<Domain.Item>> = (() => {
            switch (domain) {
                case "image": return Fetchers.get.all_images({})
                    .then(images => images.map(image => ({domain, name: image.name, image})));

                case "episodic": return Fetchers.get.full_episodic({})
                    .then(episodic => episodic.flatMap(chapter => chapter.records.map(record => ({domain, record_name: record.name, record}))));

                case "subproject": return Promise.resolve(Subproject.subprojects.map(subproject => ({domain, name: subproject.name})));
            }
            return Promise.resolve([]);
        })();

        new_items_promise.then(items => $current_items = items);
    }
</script>

<div class="domain-button-container">
    <PageLink dest={{domain}}>
        <button type="button" class="domain-button" class:selected={$current?.domain === domain} on:click={set_items}>
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