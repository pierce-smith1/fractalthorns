<script lang="ts">
    import Nav from "./nav.svelte";
    import View from "./view.svelte";

    import {layout_state} from "./page";

    function toggle_layout_state() {
        $layout_state = $layout_state === "only-nav" ? "only-page" : "only-nav";
    }
    
    function set_layout_state_by_width(width: number)  {
        if (width > 1200) {
            $layout_state = "full";
        } else if ($layout_state === "full") {
            $layout_state = "only-page";
        }
    }

    set_layout_state_by_width(window.innerWidth);

    window.onresize = event => {
        set_layout_state_by_width(window.innerWidth);
    };
</script>

<div class="page">
    <div class="container">
        <button type="button" class="toggle-layout-button" class:nav-open={$layout_state === "only-nav"} on:click={toggle_layout_state}>
            ≡ 
        </button>
        {#if $layout_state === "full"}
            <Nav />
            <View />
        {:else if $layout_state === "only-nav"}
            <Nav />
        {:else if $layout_state === "only-page"}
            <View />
        {/if}
    </div>
</div>

<style>
    .toggle-layout-button {
        display: none;
    }

    .page {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
    }

    .container {
        display: flex;
        flex-flow: row nowrap;
        gap: 20px;
        width: 95vw;
        height: 95vh;
        justify-content: center;
        align-content: stretch;
        align-items: stretch;
    }

    :global(a) {
        color: white;
        text-decoration: none;
    }

    @media (width <= 1200px) {
        .toggle-layout-button {
            display: block;
            max-height: 40px;
            min-height: 40px;
            height: 40px;
            border-radius: 5px;
            border: 1px solid white;
            color: white;
            font-size: 1.5rem;
            background-color: rgba(0 0 0 / 50%);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .nav-open {
            color: black;
            background-color: white;
        }

        .container {
            flex-flow: column nowrap;
        }
    }
</style>