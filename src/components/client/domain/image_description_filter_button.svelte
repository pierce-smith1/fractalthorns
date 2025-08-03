<script lang="ts">
    import {onMount} from "svelte"

    import * as Nav from "../nav.svelte.ts"
    import * as Page from "../page.svelte.ts"

    import * as Domain from "../../../helpers/domain"

    let props: {
        mouseover_handler: () => void,
        mouseout_handler: () => void,
    } = $props();

    let descriptions_only = $state(false);

    $effect(() => {
        if (Page.state.current.domain) {
            descriptions_only = false;
        }
    });

    const filter_fn = (item: Domain.Item) => {
        debugger;

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
    }

    onMount(() => {
        Nav.register_filter({name: "image-description-filter-button", fn: filter_fn});
        return () => Nav.unregister_filter("image-description-filter-button");
    });
</script>

<div class="description-filter-button-container">
    <button 
        type="button" 
        class="description-filter-button" 
        onclick={toggle_filter}
        onmouseover={props.mouseover_handler}
        onmouseout={props.mouseout_handler}
        onfocus={props.mouseover_handler}
        onblur={props.mouseout_handler}
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
