<script lang="ts">
    import * as Domain from "../../helpers/domain.ts";
    import * as Fetchers from "../../fetchers";

    import {current} from "./page.ts";

    import ImageView from "./views/image.svelte";
    import SketchView from "./views/sketch.svelte";
    import RecordView from "./views/record.svelte";
    import HomeView from "./views/home.svelte";
    import SubprojectView from "./views/subproject.svelte";
    import Loading from "./loading.svelte";
    import GlassPane from "./style/glass_pane.svelte";

    export let page: Domain.Page | undefined = undefined;

    $: current_page = page ?? $current;
    $: clear_bg = current_page.domain === "home" || current_page.domain === "episodic";

    let news_promise = Fetchers.get.all_news({});
    let sketches_promise = Fetchers.get.all_sketches({});
</script>

{#await Promise.all([news_promise, sketches_promise])}
    <Loading />
{:then [news, sketches]}
    <div class="view-container" class:reading-mode={current_page.domain === "episodic"}>
        <GlassPane --background-color={clear_bg ? "none" : undefined} title={`fractalthorns.com / ${news.items[0].version}`}>
            {#if current_page.domain === "home"}
                <HomeView />
            {:else if current_page.domain === "image"}
                <ImageView name={current_page.name} />
            {:else if current_page.domain === "sketch"}
                <SketchView sketch={sketches.sketches.find(sketch => sketch.name === current_page.name)} />
            {:else if current_page.domain === "episodic"}
                <RecordView name={current_page.record_name} line_index={current_page.line_index} />
            {:else if current_page.domain === "subproject"}
                <SubprojectView name={current_page.name} />
            {/if}
        </GlassPane>
    </div>
{/await}

<style>
    .view-container {
        flex-grow: 2;
        height: 100%;
    }

    .reading-mode {
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        background-color: rgba(255 255 255 / 80%);
    }

    @media (width <= 1200px) {
        .view-container {
            flex-grow: 1;
            height: auto;
            min-height: 0;
        }
    }
</style>