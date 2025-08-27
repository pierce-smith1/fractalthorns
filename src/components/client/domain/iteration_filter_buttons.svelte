<script lang="ts">
    import * as Svelte from "svelte"

    import * as Nav from "../nav.svelte.ts"
    import * as Page from "../page.svelte.ts"

    import * as RecordHelpers from "../../../helpers/record"
    import * as Domain from "../../../helpers/domain"

    import IterationSigil from "./iteration_sigil.svelte"

    const props: {
        available_iterations: Set<RecordHelpers.Iteration>,
        mouseover_handler?: (iteration: RecordHelpers.Iteration) => void,
        mouseout_handler?: (iteration: RecordHelpers.Iteration) => void,
    } = $props();

    let selected_iterations = $state([] as Array<RecordHelpers.Iteration>);
    
    const filter_fn = (item: Domain.Item) => {
        if (selected_iterations.length === 0) {
            return true;
        }

        const iteration = Domain.get_item_iteration(item);
        if (!iteration) {
            return false;
        }

        return selected_iterations.includes(iteration as RecordHelpers.Iteration);
    };

    function toggle_iteration(iteration: RecordHelpers.Iteration) {
        if (selected_iterations.includes(iteration)) {
            selected_iterations = selected_iterations.filter(iter => iter !== iteration);
        } else {
            selected_iterations = [...selected_iterations, iteration];
        }
    }

    Svelte.onMount(() => {
        Nav.register_filter({name: "iteration-filter-buttons", fn: filter_fn});
        return () => Nav.unregister_filter("iteration-filter-buttons");
    });
</script>

<div class="iteration-buttons">
    {#each new Set([...props.available_iterations, ...selected_iterations]) as iteration}
        <button 
            type="button" 
            class="iteration-button" 
            onclick={() => toggle_iteration(iteration)}
            onmouseover={() => props.mouseover_handler?.(iteration)}
            onmouseout={() => props.mouseout_handler?.(iteration)}
            onfocus={() => props.mouseover_handler?.(iteration)}
            onblur={() => props.mouseout_handler?.(iteration)}
        >
            <IterationSigil {iteration} />
            <div
                class="button-background"
                style:background-color={RecordHelpers.get_iteration_color(iteration)}
                style:border-color={RecordHelpers.get_iteration_color(iteration)}
                class:selected={selected_iterations.includes(iteration)}
            ></div>
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
</style>
