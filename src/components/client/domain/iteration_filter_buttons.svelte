<script lang="ts">
    import {nav_state, type NavItem} from "../nav";

    import * as Episodic from "../../../descriptors/public/episodic";
    import * as Domain from "../../../descriptors/domain";

    export let available_iterations: Set<Episodic.Iteration>;

    function toggle_iteration(iteration: Episodic.Iteration) {
        if ($nav_state.iteration_filters.has(iteration)) {
            $nav_state.iteration_filters.delete(iteration);
        } else {
            $nav_state.iteration_filters.add(iteration);
        }
        $nav_state.iteration_filters = $nav_state.iteration_filters;
    }

    $: {
        function mark_as_hidden(item: NavItem) {
            const hide = (() => {
                if ($nav_state.iteration_filters.size === 0) {
                    return false;
                }

                const iteration = Domain.get_item_iteration(item);
                if (!iteration) {
                    return true;
                }

                return !$nav_state.iteration_filters.has(iteration);
            })();

            return {...item, hide};
        }

        $nav_state = {...$nav_state,
            nav_results: $nav_state.nav_results.map(mark_as_hidden),
            search_results: $nav_state.search_results.map(mark_as_hidden),
        };
    }
</script>

<div class="iteration-buttons">
    {#each available_iterations as iteration}
        <button type="button" class="iteration-button" on:click={() => toggle_iteration(iteration)}>
            <div class="iteration-sigil" style:background-image={`url(/assets/images/common/iteration-${iteration}.png)`}></div>
            <div class="button-background" style:background-color={Episodic.get_iteration_color(iteration)} style:border-color={Episodic.get_iteration_color(iteration)} class:selected={$nav_state.iteration_filters.has(iteration)}></div>
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