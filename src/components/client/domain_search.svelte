<script lang="ts">
    import {nav_state, execute_search} from "./nav";

    let search_box: HTMLInputElement;

    // In the browser a timeout handle is a number, not a NodeJS.Timeout.
    // It doesn't matter for this usecase though, at least not right now.
    let submit_timeout_handle: NodeJS.Timeout | undefined = undefined; 
    const submit_timeout_debounce_ms = 500;

    function submit_search(event: KeyboardEvent) {
        // @ts-ignore
        const term = event.target.value as string;

        if (event.key === "Enter") {
            execute_search(term);
        }

        if (submit_timeout_handle) {
            clearTimeout(submit_timeout_handle);
        }

        if (event.key !== "Enter") {
            submit_timeout_handle = setTimeout(() => {
                execute_search(term);
            }, submit_timeout_debounce_ms);
        }
    }

    function clear_search() {
        $nav_state = {...$nav_state, 
            search_term: "",
            viewing_search_results: false,
        };

        search_box.value = "";

        clearTimeout(submit_timeout_handle);
        submit_timeout_handle = undefined;
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