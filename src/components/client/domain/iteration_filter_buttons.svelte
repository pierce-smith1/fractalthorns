<script lang="ts">
    import {onMount} from "svelte";

    import {nav_state, register_filter, unregister_filter} from "../nav";
    import {current} from "../page";

    import * as Episodic from "../../../descriptors/public/episodic";
    import * as Domain from "../../../descriptors/domain";

    export let available_iterations: Set<Episodic.Iteration>;

    let selected_iterations = new Set<Episodic.Iteration>();
    
    function clear_selected() {
        selected_iterations.clear();
    }

    // clear selection on changing tabs
    // If someone complains about this I'm finally gonna shoot up that cheerios factory
    $: if ($current.domain) {
        clear_selected();
    }

    const filter_fn = (item: Domain.Item) => {
        if (selected_iterations.size === 0) {
            return true;
        }

        const iteration = Domain.get_item_iteration(item);
        if (!iteration) {
            return false;
        }

        return selected_iterations.has(iteration);
    };

    function toggle_iteration(iteration: Episodic.Iteration) {
        if (selected_iterations.has(iteration)) {
            selected_iterations.delete(iteration);
        } else {
            selected_iterations.add(iteration);
        }
        selected_iterations = selected_iterations;
        $nav_state = $nav_state;
    }

    onMount(() => {
        register_filter({name: "iteration-filter-buttons", fn: filter_fn});
        return () => unregister_filter("iteration-filter-buttons");
    });
</script>

<div class="iteration-buttons">
    {#each new Set([...available_iterations, ...selected_iterations]) as iteration}
        <button type="button" class="iteration-button" on:click={() => toggle_iteration(iteration)}>
            <div class="iteration-sigil" style:background-image={`url(/assets/images/common/iteration-${iteration}.png)`}></div>
            <div class="button-background" style:background-color={Episodic.get_iteration_color(iteration)} style:border-color={Episodic.get_iteration_color(iteration)} class:selected={selected_iterations.has(iteration)}></div>
        </button>
    {/each}
</div>

<style>
    .iteration-buttons {
        display: flex;
        flex-flow: row nowrap;
        gap: 5px;
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