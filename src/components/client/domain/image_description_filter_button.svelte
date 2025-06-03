<script lang="ts">
    import {onMount} from "svelte";

    import {nav_state, register_filter, unregister_filter} from "../nav";

    import * as Domain from "../../../helpers/domain";

    let descriptions_only = false;

    export let mouseover_handler: () => void = () => {};
    export let mouseout_handler: () => void = () => {};

    const filter_fn = (item: Domain.Item) => {
        if (item.domain !== "image") {
            return true;
        }

        if (!descriptions_only) {
            return true;
        }

        return item.image.has_description === descriptions_only;
    };

    function toggle_filter() {
        descriptions_only = !descriptions_only;
        $nav_state = $nav_state;
    }

    onMount(() => {
        register_filter({name: "image-description-filter-button", fn: filter_fn});
        return () => unregister_filter("image-description-filter-button");
    });
</script>

<div class="description-filter-button-container">
    <button 
        type="button" 
        class="description-filter-button" 
        on:click={toggle_filter}
        on:mouseover={mouseover_handler} 
        on:mouseout={mouseout_handler}
        on:focus={mouseover_handler} 
        on:blur={mouseout_handler}
    >
        <div class="sigil" style:background-image={`url(/assets/images/common/alpha.png)`}></div>
        <div class="button-background" style:background-color={"white"} style:border-color={"white"} class:selected={descriptions_only}></div>
    </button>
</div>

<style>
    .description-filter-button {
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

    .sigil {
        width: 12px;
        height: 12px;
        padding: 3px;
        background-size: contain;
    }
</style>