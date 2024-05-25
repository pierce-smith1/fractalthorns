<script lang="ts">
    import * as Episodic from "../../../descriptors/episodic";

    export let selected_iterations: Set<Episodic.Iteration> = new Set();

    function toggle_iteration(iteration: Episodic.Iteration) {
        if (selected_iterations.has(iteration)) {
            selected_iterations.delete(iteration);
        } else {
            selected_iterations.add(iteration);
        }
        selected_iterations = selected_iterations;
    }
</script>

<div class="iteration-buttons">
    {#each Episodic.iterations as iteration}
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