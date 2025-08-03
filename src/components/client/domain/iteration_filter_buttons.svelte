<script lang="ts">
    import {onMount} from "svelte";

    import * as Nav from "../nav.svelte.ts";
    import * as Page from "../page.svelte.ts";

    import * as RecordHelpers from "../../../helpers/record";
    import * as Domain from "../../../helpers/domain";

    interface Props {
        available_iterations: Set<RecordHelpers.Iteration>,
        mouseover_handler?: (iteration: RecordHelpers.Iteration) => void,
        mouseout_handler?: (iteration: RecordHelpers.Iteration) => void,
    }

    const {
        available_iterations,
        mouseover_handler = () => {},
        mouseout_handler = () => {}
    } = $props();

    let selected_iterations = $state(new Set<RecordHelpers.Iteration>());
    
    // Clear selection on changing tabs
    $effect(() => {
        if (Page.state.current.domain) {
            selected_iterations = new Set();
        }
    });

    const filter_fn = (item: Domain.Item) => {
        if (selected_iterations.size === 0) {
            return true;
        }

        const iteration = Domain.get_item_iteration(item);
        if (!iteration) {
            return false;
        }

        return selected_iterations.has(iteration as RecordHelpers.Iteration);
    };

    function toggle_iteration(iteration: RecordHelpers.Iteration) {
        if (selected_iterations.has(iteration)) {
            selected_iterations.delete(iteration);
        } else {
            selected_iterations.add(iteration);
        }
        selected_iterations = selected_iterations;
    }

    onMount(() => {
        Nav.register_filter({name: "iteration-filter-buttons", fn: filter_fn});
        return () => Nav.unregister_filter("iteration-filter-buttons");
    });
</script>

<div class="iteration-buttons">
    {#each new Set([...available_iterations, ...selected_iterations]) as iteration}
        <button 
            type="button" 
            class="iteration-button" 
            onclick={() => toggle_iteration(iteration)}
            onmouseover={() => mouseover_handler(iteration)}
            onmouseout={() => mouseout_handler(iteration)}
            onfocus={() => mouseover_handler(iteration)}
            onblur={() => mouseout_handler(iteration)}
        >
            <div class="iteration-sigil" style:background-image={`url(/assets/images/common/iteration-${iteration}.png)`}></div>
            <div class="button-background" style:background-color={RecordHelpers.get_iteration_color(iteration)} style:border-color={RecordHelpers.get_iteration_color(iteration)} class:selected={selected_iterations.has(iteration)}></div>
        </button>
    {/each}
</div>

<style>
    .iteration-buttons {
        display: flex;
        flex-flow: row wrap;
        gap: 5px;
        justify-content: center;
    }

    .iteration-button {
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        background: none;
        font-size: 1em;
        border-style: solid;
        border-width: 0;
        position: relative;
    }

    .button-background {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.2s ease-out;
    }

    .button-background:hover {
        opacity: 60%;
    }

    .selected {
        opacity: 40%;
    }

    .iteration-sigil {
        width: 12px;
        height: 12px;
        padding: 3px;
        background-size: contain;
    }
</style>
