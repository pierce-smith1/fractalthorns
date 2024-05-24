<script lang="ts">
    import * as Domain from "../../descriptors/domain";
    import * as Fetchers from "../../fetchers";

    export let results_promises: Domain.HolisticSearchResults | undefined = undefined;
    export let term: string | undefined = undefined;

    function submit_search(event: KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }

        // @ts-ignore
        term = event.target.value as string;

        if (term.length === 0) {
            results_promises = undefined;
            return;
        }

        results_promises = {
            image: Fetchers.get.domain_search({term, type: "image"}),
            "episodic-item": Fetchers.get.domain_search({term, type: "episodic-item"}),
            "episodic-line": Fetchers.get.domain_search({term, type: "episodic-line"}),
        } as any;
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
        font-size: 16px;
    }
</style>