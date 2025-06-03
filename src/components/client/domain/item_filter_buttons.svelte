<script lang="ts">
    import {current} from "../page.ts";
    import {nav_state, get_items} from "../nav.ts";

    import * as RecordHelpers from "../../../helpers/record";
    import * as PrivateDomain from "../../../helpers/domain.ts";

    import IterationFilterButtons from "../domain/iteration_filter_buttons.svelte";
    import ImageDescriptionFilterButton from "../domain/image_description_filter_button.svelte";
    
    type HoveredButton = 
        | {type: "iteration", iteration: RecordHelpers.Iteration}
        | {type: "image-descriptions"}
    
    let current_hovered_button: HoveredButton | undefined = undefined;

    $: nav_items = get_items($nav_state);

    $: available_iterations = new Set(RecordHelpers.iterations.filter(iter => nav_items.map(PrivateDomain.get_item_iteration).includes(iter)));

    $: filter_tooltip_text = (() => {
        if (!current_hovered_button) {
            return "filter items";
        }

        switch (current_hovered_button.type) {
            case "iteration": return `from ${RecordHelpers.get_display_name(current_hovered_button.iteration)}`;
            case "image-descriptions": return "with descriptions";
        }
    })();

    $: filter_tooltip_color = (() => {
        if (!current_hovered_button) {
            return "rgba(255 255 255 / 50%)";
        }

        switch (current_hovered_button.type) {
            case "iteration": return RecordHelpers.get_iteration_color(current_hovered_button.iteration);
            case "image-descriptions": return "rgba(255 255 255 / 80%)";
        }
    })();

    let mouseout_timer: NodeJS.Timeout | undefined = undefined;
    function clear_mouseout_timer() {
        if (mouseout_timer) {
            clearTimeout(mouseout_timer);
        }
    }

    function on_iteration_button_mouseover(iteration: RecordHelpers.Iteration) {
        clear_mouseout_timer();
        current_hovered_button = {type: "iteration", iteration};
    }

    function on_description_button_mouseover() {
        clear_mouseout_timer();
        current_hovered_button = {type: "image-descriptions"};
    }

    function on_button_mouseout() {
        clear_mouseout_timer();
        mouseout_timer = setTimeout(() => current_hovered_button = undefined, 1000);
    }
</script>

{#if available_iterations.size > 0}
    <div class="filter-buttons-container">
        <strong class="filter-tooltip" style:color={filter_tooltip_color}>{filter_tooltip_text}</strong>
        <div class="filter-buttons">
            <IterationFilterButtons 
                {available_iterations} 
                mouseover_handler={on_iteration_button_mouseover} 
                mouseout_handler={on_button_mouseout}
            />
            {#if $current.domain === "image"}
                <ImageDescriptionFilterButton
                    mouseover_handler={on_description_button_mouseover} 
                    mouseout_handler={on_button_mouseout}
                />
            {/if}
        </div>
    </div>
{/if}

<style>
    .filter-tooltip {
        font-size: 14px;
        color: rgba(255 255 255 / 50%);
        transition: color 0.2s ease-out;
    }

    .filter-buttons-container {
        width: 90%;
    }

    .filter-buttons {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 15px;
        border: 1px solid rgba(255 255 255 / 50%);
        border-radius: 5px;
        padding: 10px;
    }
</style>