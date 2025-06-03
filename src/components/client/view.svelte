<script lang="ts">
    import * as Domain from "../../helpers/domain.ts";
    import * as Fetchers from "../../fetchers";

    import {current} from "./page.ts";

    import HomeView from "./views/home.svelte";
    import ImageView from "./views/image.svelte";
    import SketchView from "./views/sketch.svelte";
    import RecordView from "./views/record.svelte";
    import PuzzleView from "./views/puzzle.svelte";
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
    <div class="view-container" class:reading-mode={current_page.domain === "episodic"} class:solving-mode={current_page.domain === "discover"}>
        <GlassPane 
            --background-color={clear_bg ? "none" : undefined} 
            --blur-amount={current_page.domain === "episodic" ? "0px" : "10px"}
            title={`fractalthorns.com / ${news.items.filter(item => item.version)[0].version}`}
        >
            {#if current_page.domain === "home"}
                <HomeView />
            {:else if current_page.domain === "image"}
                <ImageView name={current_page.name} />
            {:else if current_page.domain === "sketch"}
                <SketchView sketch={sketches.sketches.find(sketch => sketch.name === current_page.name)} />
            {:else if current_page.domain === "episodic"}
                <!-- TODO This is probably how everything should be done. The views shouldn't be left to load their own shit. -->
                {#await Promise.all([Fetchers.get.single_record({name: current_page.record_name}), Fetchers.get.record_text({name: current_page.record_name})])}
                    <Loading />
                {:then [record, text]} 
                    <RecordView {record} {text} line_index={current_page.line_index} />
                {:catch}
                    <div class="record-error-container">
                        <em class="record-error-text">this memory is hazy...</em>
                    </div>
                {/await}
            {:else if current_page.domain === "discover"}
                <PuzzleView name={current_page.name} />
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
        border-radius: 5px;
    }

    .reading-mode {
        /* BRITTLE over the record gutter deco */
        background-image: linear-gradient(to right, transparent, 65px, rgba(255 255 255 / 80%) 65px); 
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
    }

    .solving-mode {
        background-color: rgba(0 0 0 / 40%);
    }

    .record-error-container {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
    }

    @media (width <= 1200px) {
        .view-container {
            flex-grow: 1;
            height: auto;
            min-height: 0;
        }

        .reading-mode {
            background-color: rgba(255 255 255 / 80%);
            background-image: none;
        }
    }
</style>