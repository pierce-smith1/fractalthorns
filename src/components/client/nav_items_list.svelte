<script lang="ts">
    import {current} from "./page.ts";
    import {nav_state} from "./nav.ts";

    import ImageButton from "./domain/image_button.svelte";
    import IterationFilterButtons from "./domain/iteration_filter_buttons.svelte";
    import EpisodicButton from "./domain/episodic_button.svelte";
    import SubprojectButton from "./domain/subproject_button.svelte";
    import Keynav from "./views/keynav.svelte";

    import * as GenericUtil from "../../genericutil";
    import * as Domain from "../../descriptors/domain";
    import * as Subproject from "../../descriptors/subproject";
    import * as Episodic from "../../descriptors/episodic";

    function get_neighbor(index: number, items: Array<Domain.Item>, direction: "prev" | "next") {
        const neighbor = GenericUtil.neighbors(index, items)[direction === "prev" ? 0 : 1];

        if (neighbor === items[index]) {
            return undefined;
        }

        if (neighbor.domain === "episodic") {
            return neighbor.record;
        }
    }

    function get_subproject(name: string) {
        return Subproject.subprojects.find(subproject => subproject.name === name)!;
    }

    $: nav_items = $nav_state.viewing_search_results ?
        $nav_state.search_results
        : $nav_state.nav_results;

    $: console.log({$nav_state});
    $: console.log({nav_items});

    $: available_iterations = new Set(Episodic.iterations.filter(iter => nav_items.map(Domain.get_item_iteration).includes(iter)));
    $: items_to_show = nav_items.filter(item => !item.hide);

    $: current_page_index = items_to_show.findIndex(item =>
        (item.domain === "image" && $current.domain === "image" && item.name === $current.name) ||
        (item.domain === "episodic" && $current.domain === "episodic" && item.record_name == $current.record_name && item.line_index == $current.line_index)
    );
    $: neighbor_pages = GenericUtil.neighbors(current_page_index, items_to_show);
</script>

<div class="nav-items-list">
    <IterationFilterButtons {available_iterations} />
    <div class="items-list">
        {#each items_to_show as item, i}
            {#if item.domain === "image"}
                <ImageButton image={item.image} />
            {:else if item.domain === "episodic"}
                <EpisodicButton record={item.record} 
                    prev_neighbor={get_neighbor(i, items_to_show, "prev")} 
                    preview_matched_text={item.matched_text}
                    preview_line_index={item.line_index}
                />
            {:else if item.domain === "subproject"}
                <SubprojectButton subproject={get_subproject(item.name ?? "")} />
            {/if}
        {/each}
        {#if items_to_show.length === 0 && $nav_state.search_waiting}
            <p class="nothing-warning"><em>searching...</em></p>
        {:else if items_to_show.length === 0}
            <p class="nothing-warning"><em>nothing was found</em></p>
        {/if}
    </div>
</div>
<Keynav
    page_up={neighbor_pages[0]}
    page_down={neighbor_pages[1]}
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

    .nothing-warning {
        text-align: center;
    }
</style>