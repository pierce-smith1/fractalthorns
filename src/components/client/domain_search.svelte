<script lang="ts">
    import * as Nav from "./nav.svelte.ts"

    let search_box: HTMLInputElement;

    // In the browser a timeout handle is a number, not a NodeJS.Timeout.
    // It doesn't matter for this usecase though, at least not right now.
    let submit_timeout_handle: NodeJS.Timeout | null = null;
    const submit_timeout_debounce_ms = 500;

    function submit_search(event: KeyboardEvent) {
        // @ts-ignore
        const term = event.target.value as string;

        if (event.key === "Enter") {
            Nav.execute_search(term, {set_term: false});
        }

        if (submit_timeout_handle) {
            clearTimeout(submit_timeout_handle);
        }

        if (event.key !== "Enter") {
            submit_timeout_handle = setTimeout(() => {
                Nav.execute_search(term);
            }, submit_timeout_debounce_ms);
        }
    }

    function clear_search() {
        Nav.clear_search();

        search_box.value = "";

        if (submit_timeout_handle) {
            clearTimeout(submit_timeout_handle);
        }

        submit_timeout_handle = null;
    }
</script>

<div class="domain-search-container">
    <input bind:this={search_box} type="search" class="domain-search-box" placeholder="search everything" onkeyup={submit_search} value={Nav.state.search_term} />
    {#if Nav.state.viewing_search_results}
        <button type="button" class="close-search-button" onclick={clear_search}>╳</button>
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
