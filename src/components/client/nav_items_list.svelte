<script lang="ts">
    import * as Page from "./page.svelte.ts"
    import * as Nav from "./nav.svelte.ts"

    import ImageButton from "./domain/image_button.svelte"
    import EpisodicButton from "./domain/episodic_button.svelte"
    import PuzzleButton from "./domain/puzzle_button.svelte"
    import SubprojectButton from "./domain/subproject_button.svelte"
    import SketchButton from "./domain/sketch_button.svelte"
    import TaleButton from "./domain/tale_button.svelte"
    import Keynav from "./views/keynav.svelte"
    import Loading from "./loading.svelte"
    import ItemFilterButtons from "./domain/item_filter_buttons.svelte"

    import * as GenericUtil from "../../genericutil"
    import * as Domain from "../../helpers/domain.ts"
    import * as Subproject from "../../helpers/subproject.ts"

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
        return domain === "sketch" ? "sketch-items-list"
            : "items-list";
    }

    let visible_items = $derived(Nav.get_visible_items(Nav.state));
    let visible_domains = $derived(new Set(visible_items.map(item => item.domain)));

    let current_page_index = $derived(visible_items.findIndex(item =>
        (item.domain === "image" && Page.state.current.domain === "image" && item.image.name === Page.state.current.name) ||
        (item.domain === "sketch" && Page.state.current.domain === "sketch" && item.sketch.name === Page.state.current.name) ||
        (item.domain === "episodic-item" && Page.state.current.domain === "episodic" && item.record.name === Page.state.current.record_name) ||
        (item.domain === "episodic-line" && Page.state.current.domain === "episodic" && item.record.name === Page.state.current.record_name && item.line_index === Page.state.current.line_index) ||
        (item.domain === "tale" && Page.state.current.domain === "tale" && item.tale.name === Page.state.current.name) ||
        (item.domain === "discover" && Page.state.current.domain === "discover" && item.puzzle.name === Page.state.current.name) ||
        (item.domain === "subproject" && Page.state.current.domain === "subproject" && item.name === Page.state.current.name)
    ));

    $effect(() => {
        const current_item_element = document.querySelector<HTMLDivElement>(`#item-${current_page_index}`);
        current_item_element?.scrollIntoView({behavior: "smooth", block: "center"});
    });

    let neighbor_pages = $derived(GenericUtil.neighbors(current_page_index, visible_items));
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
                        {:else if item.domain === "tale"}
                            <TaleButton tale={item.tale} />
                        {:else if item.domain === "subproject"}
                            <SubprojectButton subproject={get_subproject(item.name ?? "")} />
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    {/each}

    {#if Nav.state.search_waiting}
        <Loading />
    {:else if visible_items.length === 0 && Nav.state.viewing_search_results}
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
