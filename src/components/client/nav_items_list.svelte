<script lang="ts">
    import {current} from "./page.ts";
    import {nav_state, get_visible_items} from "./nav.ts";

    import ImageButton from "./domain/image_button.svelte";
    import EpisodicButton from "./domain/episodic_button.svelte";
    import PuzzleButton from "./domain/puzzle_button.svelte";
    import SubprojectButton from "./domain/subproject_button.svelte";
    import SketchButton from "./domain/sketch_button.svelte";
    import Keynav from "./views/keynav.svelte";
    import Loading from "./loading.svelte";
    import ItemFilterButtons from "./domain/item_filter_buttons.svelte";

    import * as GenericUtil from "../../genericutil";
    import * as Domain from "../../helpers/domain.ts";
    import * as Subproject from "../../helpers/subproject.ts";

    function get_neighboring_record(index: number, items: Array<Domain.Item>, direction: "prev" | "next") {
        const neighbor = GenericUtil.neighbors(index, items)[direction === "prev" ? 0 : 1];

        if (neighbor === items[index]) {
            return undefined;
        }

        if (neighbor.domain === "episodic-item" || neighbor.domain === "episodic-line") {
            return neighbor.record;
        }
    }

    function get_neighboring_puzzle(index: number, items: Array<Domain.Item>, direction: "prev" | "next") {
        const neighbor = GenericUtil.neighbors(index, items)[direction === "prev" ? 0 : 1];

        if (neighbor === items[index]) {
            return undefined;
        }

        if (neighbor.domain === "discover") {
            return neighbor.puzzle;
        }
    }

    function get_subproject(name: string) {
        return Subproject.subprojects.find(subproject => subproject.name === name)!;
    }

    function get_sublist_classname(domain: Domain.Item["domain"]) {
        switch (domain) {
            case "sketch": return "sketch-items-list";
            default: return "items-list";
        }
    }

    $: visible_items = get_visible_items($nav_state);
    $: visible_domains = new Set(visible_items.map(item => item.domain));

    $: current_page_index = visible_items.findIndex(item =>
        (item.domain === "image" && $current.domain === "image" && item.image.name === $current.name) ||
        (item.domain === "sketch" && $current.domain === "sketch" && item.sketch.name === $current.name) ||
        (item.domain === "episodic-item" && $current.domain === "episodic" && item.record.name === $current.record_name) ||
        (item.domain === "episodic-line" && $current.domain === "episodic" && item.record.name === $current.record_name && item.line_index === $current.line_index) ||
        (item.domain === "discover" && $current.domain === "discover" && item.puzzle.name === $current.name) ||
        (item.domain === "subproject" && $current.domain === "subproject" && item.name === $current.name)
    );

    $: {
        const current_item_element = document.querySelector<HTMLDivElement>(`#item-${current_page_index}`);
        current_item_element?.scrollIntoView({behavior: "smooth", block: "center"});
    }

    $: neighbor_pages = GenericUtil.neighbors(current_page_index, visible_items);
</script>

<div class="nav-items-list">
    <ItemFilterButtons />

    {#each visible_domains as domain}
        <div class={get_sublist_classname(domain)}>
            {#each visible_items as item, i}
                {#if item.domain === domain}
                    <div id={`item-${i}`}>
                        {#if item.domain === "image"}
                            <ImageButton image={item.image} />
                        {:else if item.domain === "sketch"}
                            <SketchButton sketch={item.sketch} />
                        {:else if item.domain === "episodic-item"}
                            <EpisodicButton record={item.record} 
                                prev_neighbor={get_neighboring_record(i, visible_items, "prev")} 
                            />
                        {:else if item.domain === "episodic-line"}
                            <EpisodicButton record={item.record}
                                prev_neighbor={get_neighboring_record(i, visible_items, "prev")} 
                                preview_matched_text={item.matched_text}
                                preview_line_index={item.line_index}
                            />
                        {:else if item.domain === "discover"}
                            <PuzzleButton puzzle={item.puzzle}
                                prev_neighbor={get_neighboring_puzzle(i, visible_items, "prev")}
                            />
                        {:else if item.domain === "subproject"}
                            <SubprojectButton subproject={get_subproject(item.name ?? "")} />
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    {/each}

    {#if $nav_state.search_waiting}
        <Loading />
    {:else if visible_items.length === 0 && $nav_state.viewing_search_results}
        <p class="nothing-warning"><em>nothing was found</em></p>
    {/if}
</div>
<Keynav
    page_up={neighbor_pages[0] ? Domain.item_to_page(neighbor_pages[0]) : undefined}
    page_down={neighbor_pages[1] ? Domain.item_to_page(neighbor_pages[1]) : undefined}
/>

<style>
    .nav-items-list {
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }

    .items-list {
        width: 90%;
        display: flex;
        flex-flow: column nowrap;
        gap: 0.3rem;
        margin: 1rem 0 1rem 0;
    }

    .sketch-items-list {
        margin: 1rem 0 1rem 0;
        width: 90%;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
        gap: 5px;
    }

    .nothing-warning {
        text-align: center;
    }
</style>