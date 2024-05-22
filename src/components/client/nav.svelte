<script lang="ts">
    import * as Domain from "../../descriptors/domain";

    import {current} from "./page.ts";

    import ImageList from "./domain/images_list.svelte";
    import DomainSearch from "./domain_search.svelte";
    import DomainSearchResults from "./domain_search_results.svelte";
    import Loading from "./loading.svelte";
    import EpisodicList from "./domain/episodic_list.svelte";
    import NavButton from "./nav_button.svelte";
    import News from "./news.svelte";

    let domain_search_results: Promise<Array<Domain.Page>> | undefined = undefined;
    $: showing_search_results = !!domain_search_results;

    function reset_search_results() {
        showing_search_results = false;
    }
</script>

<nav>
    <div class="nav-sticky"> 
        <div class="domain-buttons">
            <NavButton domain={"home"} {showing_search_results} {reset_search_results} />
            <NavButton domain={"image"} {showing_search_results} {reset_search_results} />
            <NavButton domain={"episodic"} {showing_search_results} {reset_search_results} />
        </div>
        <div class="domain-search">
            <DomainSearch bind:results={domain_search_results} />
        </div>
    </div>

    {#if domain_search_results && showing_search_results}
        {#await domain_search_results}
            <Loading />
        {:then results} 
            <DomainSearchResults results={results} />
        {/await}
    {:else}
        {#if $current.domain === "home"}
            <News />
        {:else if $current.domain === "image"}
            <ImageList />
        {:else if $current.domain === "episodic"}
            <EpisodicList />
        {/if}
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
