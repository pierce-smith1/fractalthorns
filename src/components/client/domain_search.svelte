<script lang="ts">
    import * as Fetchers from "../../fetchers";
    import * as Domain from "../../descriptors/domain";

    import {current_items, currently_searching} from "./nav";

    export let term: string | undefined = undefined;

    function submit_search(event: KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }

        // @ts-ignore
        term = event.target.value as string;

        if (term.length === 0) {
            $current_items = [];
            return;
        }

        const image_results = Fetchers.get.domain_search({term, type: "image"});
        const record_results = Fetchers.get.domain_search({term, type: "episodic-item"});
        const line_results = Fetchers.get.domain_search({term, type: "episodic-line"});

        $current_items = [];
        $currently_searching = true;

        image_results.then(images => $current_items = Domain.sort_items([...$current_items, ...images]));
        record_results.then(records => $current_items = Domain.sort_items([...$current_items, ...records]));
        line_results.then(lines => $current_items = Domain.sort_items([...$current_items, ...lines]));

        Promise.all([image_results, record_results, line_results]).then(_ => $currently_searching = false);
    }
</script>

<div class="domain-search-container">
    <input type="search" placeholder="search everything" on:keyup={submit_search} />
</div>

<style>
    .domain-search-container {
        width: 100%;
    }

    input {
        width: 100%;
        height: 30px;
        border-radius: 5px;
        background-color: #111;
        border: 1px solid rgba(255 255 255 / 50%);
        color: white;
        font-size: 1em;
    }
</style>