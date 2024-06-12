<script lang="ts">
    import {nav_state, execute_search} from "./nav";

    let search_box: HTMLInputElement;

    function clear_search() {
        $nav_state = {...$nav_state, 
            search_term: "",
            viewing_search_results: false,
        };

        search_box.value = "";
    }

    function submit_search(event: KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }

        // @ts-ignore
        const term = event.target.value as string;
        execute_search(term);
    }

    $: if (search_box) {
        search_box.value = $nav_state.search_term;
    }
</script>

<div class="domain-search-container">
    <input bind:this={search_box} type="search" class="domain-search-box" placeholder="search everything" on:keyup={submit_search} />
    {#if $nav_state.viewing_search_results}
        <button type="button" class="close-search-button" on:click={clear_search}>╳</button>
    {/if}
</div>

<style>
    .domain-search-container {
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
        gap: 0.8rem;
    }

    .domain-search-box {
        width: 100%;
        height: 30px;
        border-radius: 5px;
        background-color: #111;
        border: 1px solid rgba(255 255 255 / 50%);
        color: white;
        font-size: 1em;
    }

    .close-search-button {
        width: 2rem;
        border-radius: 5px;
        border: 1px solid rgba(255 255 255 / 50%);
        color: white;
        background-color: #111;
        transition: background-color 0.2s ease-out, color 0.2s ease-out;
    }

    .close-search-button:hover {
        background-color: white;
        color: #111;
    }
</style>