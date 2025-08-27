<script lang="ts">
    import Nav from "./nav.svelte"
    import View from "./view.svelte"

    import * as Page from "./page.svelte.ts"

    import GlassButton from "./style/glass_button.svelte"

    function toggle_layout_state() {
        Page.state.layout = Page.state.layout === "only-nav" ? "only-page" : "only-nav";
    }

    function update_layout() {
        set_layout_state_by_width(window.innerWidth);
    }

    function set_layout_state_by_width(width: number)  {
        if (width > 1200) {
            Page.state.layout = "full";
        } else if (Page.state.layout === "full") {
            Page.state.layout = "only-page";
        }
    }

    function restore() {
        Page.state.minimized = false;
    }

    update_layout();

    window.onresize = _event => {
        update_layout();
    };
</script>

<div class="page">
    <div class="container" class:minimized={Page.state.minimized}>
        <button type="button" class="toggle-layout-button" class:nav-open={Page.state.layout === "only-nav"} on:click={toggle_layout_state}>
            ≡ 
        </button>

        {#if Page.state.layout === "full"}
            <Nav />
            <View />
        {:else if Page.state.layout === "only-nav"}
            <Nav />
        {:else if Page.state.layout === "only-page"}
            <View />
        {/if}
    </div>

    {#if Page.state.minimized}
        <div class="restore-button">
            <GlassButton onclick={restore}>restore</GlassButton>
        </div>
    {/if}
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
        transition: opacity 0.2s ease-in;
    }

    .minimized {
        opacity: 0;
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

    .restore-button {
        position: absolute;
        top: 1em;
        right: 2em;
        opacity: 0.5;
    }
</style>
