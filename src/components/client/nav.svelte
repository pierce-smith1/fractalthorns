<script lang="ts">
    import {current} from "./page.ts";
    import {nav_state} from "./nav.ts";

    import GlassPane from "./style/glass_pane.svelte";
    import DomainSearch from "./domain_search.svelte";
    import NavButton from "./nav_button.svelte";
    import News from "./news.svelte";
    import NavItemsList from "./nav_items_list.svelte";
    import ExtrasWidget from "./extras_widget.svelte";
</script>

<div class="nav-container">
    <GlassPane title_bar={false}>
        <nav>
            <div class="nav-gutter">
                <div class="domain-buttons">
                    <NavButton domain={"home"} />
                    <NavButton domain={"image"} />
                    <NavButton domain={"episodic"} />
                    <NavButton domain={"subproject"} />
                    <NavButton domain={"sketch"} minor={true} />
                </div>
            </div>
            <div class="nav-contents">
                <div class="nav-sticky"> 
                    <div class="domain-search">
                        <DomainSearch />
                    </div>
                </div>

                {#if $nav_state.viewing_search_results || $nav_state.search_waiting}
                    <NavItemsList />
                {:else if $current.domain === "home"}
                    <News />
                {:else}
                    <NavItemsList />
                {/if}

                <div class="nav-spacer"></div>
            </div>
        </nav>
    </GlassPane>
    <ExtrasWidget />
</div>

<style>
    .nav-container {
        display: flex;
        flex-flow: column nowrap;
        gap: 10px;
        min-width: 360px;
        max-width: 360px;
    }

    nav {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;
        justify-content: flex-start;
        color: white;
        border-radius: 5px;
    }

    .nav-gutter {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        position: sticky;
        top: 0;
        padding: 10px 0 0 10px;
        min-height: 100%;
    }

    .nav-contents {
        display: flex;
        flex-flow: column nowrap;
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
