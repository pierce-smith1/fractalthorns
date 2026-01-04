<script lang="ts">
    import * as Page from "./page.svelte.ts";
    import * as Nav from "./nav.svelte.ts";

    import GlassPane from "./style/glass_pane.svelte";
    import DomainSearch from "./domain_search.svelte";
    import NavButton from "./nav_button.svelte";
    import News from "./news.svelte";
    import NavItemsList from "./nav_items_list.svelte";
    import ExtrasWidget from "./extras_widget.svelte";

    let collapsed: boolean = $state(false);

    function toggle_collapsed() {
        collapsed = !collapsed;
    }
</script>

<div class="nav-container" class:nav-collapsed={collapsed}>
    <GlassPane title_bar={false}>
        <nav>
            <div class="nav-gutter">
                <div class="domain-buttons">
                    <div class="domain-button-group">
                        <NavButton domain={"home"} />
                    </div>
                    <div class="domain-button-group">
                        <NavButton domain={"image"} />
                        <NavButton domain={"sketch"} minor={true} />
                    </div>
                    <div class="domain-button-group">
                        <NavButton domain={"episodic"} />
                        <NavButton domain={"discover"} minor={true} />
                    </div>
                    <div class="domain-button-group">
                        <NavButton domain={"subproject"} />
                    </div>
                </div>
            </div>
            <div class="nav-contents">
                <div class="nav-sticky">
                    <div class="domain-search">
                        <DomainSearch />
                    </div>
                </div>

                {#if Nav.state.viewing_search_results || Nav.state.search_waiting}
                    <NavItemsList />
                {:else if Page.state.current.domain === "home"}
                    <News />
                {:else}
                    <NavItemsList />
                {/if}

                <div class="nav-spacer"></div>
            </div>
            <button type="button" class="collapse-button" onclick={toggle_collapsed}>
                {collapsed ? ">" : "<"}
            </button>
        </nav>
    </GlassPane>

    {#if !collapsed}
        <ExtrasWidget />
    {/if}
</div>

<style>
    .nav-container {
        display: flex;
        flex-flow: column nowrap;
        gap: 10px;
        min-width: 392px;
        max-width: 392px;
    }

    .nav-collapsed.nav-container {
        min-width: auto;
    }

    nav {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;
        justify-content: flex-start;
        color: white;
        border-radius: 5px;
        height: 100%;
    }

    .nav-gutter {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        position: sticky;
        top: 0;
        padding: 10px 10px 0 10px;
        background: rgba(255 255 255 / 25%);
        height: 100%;
        box-sizing: border-box;
        transition: width 0.2s ease-out;
    }

    .nav-collapsed .nav-gutter {
        display: none;
        width: 0;
    }

    .nav-contents {
        display: flex;
        flex-flow: column nowrap;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
        height: 100%;
        width: 100%;
        transition: width 0.2s ease-out, opacity 0.1s ease-out;
    }

    .nav-collapsed .nav-contents {
        opacity: 0;
        width: 0;
    }

    .nav-sticky {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        background: linear-gradient(rgba(0 0 0 / 75%), rgba(0 0 0 / 0%));
        position: sticky;
        top: 0;
        left: 0;
        width: 90%;
        gap: 10px;
        padding: 15px;
        z-index: 1000;
    }

    .nav-spacer {
        width: 300px;
    }

    .domain-buttons {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        align-items: center;
        gap: 10px;
    }

    .domain-button-group {
        display: flex;
        flex-flow: column nowrap;
        gap: 7px;
        border-radius: 5px;
        border: 1px solid rgba(255 255 255 / 50%);
        padding: 5px;
    }

    .collapse-button {
        background: none;
        border: none;
        color: rgba(255 255 255 / 50%);
        height: 100%;
        transition: background-color 0.2s ease-out, color 0.2s ease-out, width 0.4s ease-out;
        cursor: pointer;
        width: 20px;
    }

    .nav-collapsed .collapse-button {
        width: 20px;
    }

    button:hover {
        color: black;
        background-color: white;
    }

    @media (width <= 1200px) {
        nav {
            max-width: 100%;
            height: 100%;
        }

        .nav-container {
            min-height: 0;
        }
    }
</style>
