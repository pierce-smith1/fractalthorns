<script lang="ts">
    import * as Domain from "../../descriptors/domain";
    import * as Fetchers from "../../fetchers";

    export let results: Promise<Array<Domain.Page>> | undefined = undefined;

    function submit_search(event: KeyboardEvent) {
        if (event.key !== "Enter") {
            return;
        }

        // @ts-ignore
        const term = event.target.value as string;

        if (term.length === 0) {
            results = undefined;
            return;
        }

        results = Fetchers.get.domain_search(term);
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