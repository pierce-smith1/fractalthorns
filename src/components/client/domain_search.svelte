<script lang="ts">
    import * as Fetchers from "../../fetchers";
    import * as Domain from "../../descriptors/domain";

    import {nav_state} from "./nav";

    export let term: string | undefined = undefined;

    function submit_search(event: KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }

        // @ts-ignore
        term = event.target.value as string;

        if (term.length === 0) {
            $nav_state = {...$nav_state,
                search_results: [],
                search_waiting: false,
                viewing_search_results: true,
            }
            return;
        }

        const image_results = Fetchers.get.domain_search({term, type: "image"});
        const record_results = Fetchers.get.domain_search({term, type: "episodic-item"});
        const line_results = Fetchers.get.domain_search({term, type: "episodic-line"});

        $nav_state = {...$nav_state,
            search_results: [],
            search_waiting: true,
        };

        function update_search_items(items: Array<Domain.Item>) {
            $nav_state = {...$nav_state, search_results: Domain.sort_items([...$nav_state.search_results, ...items])};
        }

        image_results.then(update_search_items);
        record_results.then(update_search_items);
        line_results.then(update_search_items);

        Promise.all([image_results, record_results, line_results]).then(_ => {
            $nav_state = {...$nav_state,
                search_waiting: false,
                viewing_search_results: true,
            };
        });
    }

    function clear_search() {
        $nav_state = {...$nav_state, viewing_search_results: false};

        const search_box = document.querySelector(".domain-search-box");
        if (search_box) {
            // @ts-ignore
            search_box.value = "";
        }
    }
</script>

<div class="domain-search-container">
    <input type="search" class="domain-search-box" placeholder="search everything" on:keyup={submit_search} />
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