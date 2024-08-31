<script lang="ts">
    import {current} from "./page.ts";
    import {nav_state, get_items, get_visible_items} from "./nav.ts";

    import ImageButton from "./domain/image_button.svelte";
    import IterationFilterButtons from "./domain/iteration_filter_buttons.svelte";
    import EpisodicButton from "./domain/episodic_button.svelte";
    import SubprojectButton from "./domain/subproject_button.svelte";
    import Keynav from "./views/keynav.svelte";

    import * as RecordHelpers from "../../helpers/record";
    import * as GenericUtil from "../../genericutil";
    import * as PrivateDomain from "../../helpers/domain.ts";
    import * as Subproject from "../../helpers/subproject.ts";
    import ImageDescriptionFilterButton from "./domain/image_description_filter_button.svelte";

    function get_neighbor(index: number, items: Array<PrivateDomain.Item>, direction: "prev" | "next") {
        const neighbor = GenericUtil.neighbors(index, items)[direction === "prev" ? 0 : 1];

        if (neighbor === items[index]) {
            return undefined;
        }

        if (neighbor.domain === "episodic-item" || neighbor.domain === "episodic-line") {
            return neighbor.record;
        }
    }

    function get_subproject(name: string) {
        return Subproject.subprojects.find(subproject => subproject.name === name)!;
    }

    $: nav_items = get_items($nav_state);

    $: available_iterations = new Set(RecordHelpers.iterations.filter(iter => nav_items.map(PrivateDomain.get_item_iteration).includes(iter)));

    $: visible_items = get_visible_items($nav_state);

    $: current_page_index = visible_items.findIndex(item =>
        (item.domain === "image" && $current.domain === "image" && item.image.name === $current.name) ||
        (item.domain === "episodic-item" && $current.domain === "episodic" && item.record.name == $current.record_name) ||
        (item.domain === "episodic-line" && $current.domain === "episodic" && item.record.name == $current.record_name && item.line_index == $current.line_index) ||
        (item.domain === "subproject" && $current.domain === "subproject" && item.name == $current.name)
    );

    $: {
        const current_item_element = document.querySelector<HTMLDivElement>(`#item-${current_page_index}`);
        current_item_element?.scrollIntoView({behavior: "smooth", block: "center"});
    }

    $: neighbor_pages = GenericUtil.neighbors(current_page_index, visible_items);
</script>

<div class="nav-items-list">
    <div class="filter-buttons">
        <IterationFilterButtons {available_iterations} />
        {#if $current.domain === "image"}
            <ImageDescriptionFilterButton />
        {/if}
    </div>
    <div class="items-list">
        {#each visible_items as item, i}
            <div id={`item-${i}`}>
                {#if item.domain === "image"}
                    <ImageButton image={item.image} />
                {:else if item.domain === "episodic-item"}
                    <EpisodicButton record={item.record} 
                        prev_neighbor={get_neighbor(i, visible_items, "prev")} 
                    />
                {:else if item.domain === "episodic-line"}
                    <EpisodicButton record={item.record} 
                        prev_neighbor={get_neighbor(i, visible_items, "prev")} 
                        preview_matched_text={item.matched_text}
                        preview_line_index={item.line_index}
                    />
                {:else if item.domain === "subproject"}
                    <SubprojectButton subproject={get_subproject(item.name ?? "")} />
                {/if}
            </div>
        {/each}
        {#if $nav_state.search_waiting}
            <p class="nothing-warning"><em>searching...</em></p>
        {:else if visible_items.length === 0 && $nav_state.viewing_search_results}
            <p class="nothing-warning"><em>nothing was found</em></p>
        {/if}
    </div>
</div>
<Keynav
    page_up={neighbor_pages[0] ? PrivateDomain.item_to_page(neighbor_pages[0]) : undefined}
    page_down={neighbor_pages[1] ? PrivateDomain.item_to_page(neighbor_pages[1]) : undefined}
/>

<style>
    .nav-items-list {
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }

    .filter-buttons {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 15px;
    }

    .items-list {
        width: 90%;
        display: flex;
        flex-flow: column nowrap;
        gap: 0.3rem;
        margin: 1rem 0 1rem 0;
    }

    .nothing-warning {
        text-align: center;
    }
</style>