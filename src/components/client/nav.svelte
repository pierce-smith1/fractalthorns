<script lang="ts">
    import {current} from "./page.ts";
    import {current_items, currently_searching, search_finished} from "./nav.ts";

    import DomainSearch from "./domain_search.svelte";
    import NavButton from "./nav_button.svelte";
    import News from "./news.svelte";
    import NavItemsList from "./nav_items_list.svelte";
</script>

<nav>
    <div class="nav-sticky"> 
        <div class="domain-buttons">
            <NavButton domain={"home"} />
            <NavButton domain={"image"} />
            <NavButton domain={"episodic"} />
            <NavButton domain={"subproject"} />
        </div>
        <div class="domain-search">
            <DomainSearch />
        </div>
    </div>

    {#if $current.domain === "home" && (!$currently_searching && !$search_finished)}
        <News />
    {:else}
        <NavItemsList />
    {/if}

    <div class="nav-spacer">
    </div>
</nav>

<style>
    nav {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: flex-start;
        color: white;
        border: 1px solid white;
        border-radius: 5px;
        background-color: rgba(0 0 0 / 50%);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        min-width: 300px;
        max-width: 300px;
        max-height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
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
        padding: 10px;
        z-index: 1000;
    }

    .nav-spacer {
        width: 300px;
    }

    .domain-buttons {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        top: 0;
        left: 0;
        gap: 10px;
    }
</style>
