<script lang="ts">
    import * as Domain from "../../descriptors/domain";
    import * as Fetchers from "../../fetchers";

    import {current} from "./page.ts";

    import ImageView from "./views/image.svelte";
    import RecordView from "./views/record.svelte";
    import HomeView from "./views/home.svelte";
    import SubprojectView from "./views/subproject.svelte";
    import Loading from "./loading.svelte";

    export let page: Domain.Page | undefined = undefined;

    $: current_page = page ?? $current;

    let news_promise = Fetchers.get.all_news({});
</script>

<div class="view-container" class:clear={current_page.domain === "home"} class:reading-mode={current_page.domain === "episodic"}>
    {#if current_page.domain === "home"}
        <HomeView />
    {:else if current_page.domain === "image"}
        {#if current_page.name}
            <ImageView name={current_page.name} />
        {/if}
    {:else if current_page.domain === "episodic"}
        <RecordView name={current_page.record_name} line_index={current_page.line_index} />
    {:else if current_page.domain === "subproject"}
        <SubprojectView name={current_page.name} />
    {/if}
</div>
<div class="view-title-surrogate">
    {#await news_promise}
        <Loading />
    {:then news}
        <span class="window-title">fractalthorns.com / {news[0].version}</span>
    {/await}
</div>

<style>
    .view-container {
        border: 2px solid white;
        border-top-width: 20px;
        border-radius: 5px;
        background-color: rgba(0 0 0 / 50%);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        flex-grow: 5;
        overflow-y: auto;
    }

    .reading-mode {
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        background-color: rgba(255 255 255 / 80%);
    }

    .clear {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
    }

    .view-title-surrogate {
        position: relative;
    }

    .window-title {
        color: rgba(0 0 0 / 50%);
        position: absolute;
        top: -2px;
        right: 25px;
        text-align: right;
        width: 1000px;
        padding: 0;
        margin: 0;
        font-size: 0.9em;
        z-index: 1000;
    }
</style>