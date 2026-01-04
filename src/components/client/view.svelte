<script lang="ts">
    import * as Api from "../../api/api"
    import * as Domain from "../../helpers/domain.ts"
    import * as Fetchers from "../../fetchers"

    import * as Page from "./page.svelte.ts"

    import HomeView from "./views/home.svelte"
    import ImageView from "./views/image.svelte"
    import SketchView from "./views/sketch.svelte"
    import RecordView from "./views/record.svelte"
    import PuzzleView from "./views/puzzle.svelte"
    import TaleView from "./views/tale.svelte"
    import SubprojectView from "./views/subproject.svelte"
    import Loading from "./loading.svelte"
    import GlassPane from "./style/glass_pane.svelte"

    let {page = undefined}: {
        page?: Domain.Page,
    } = $props();

    let current_page = $derived(page ?? Page.state.current);
    let clear_bg = $derived(current_page.domain === "home" || current_page.domain === "episodic");

    let news_promise = Fetchers.get.all_news({});

    async function get_image_data(name?: string): Promise<{image: Api.ImageObject, description?: string}> {
        const image = await Fetchers.get.single_image({name});

        const description = image.has_description
            ? (await Fetchers.get.image_description({name: image.name})).description
            : undefined;

        return {image, description};
    }

    async function get_sketch_data(name?: string): Promise<Api.SketchObject> {
        const sketch = await Fetchers.get.single_sketch({name});
        return sketch;
    }

    async function get_record_data(name?: string): Promise<{entry: Api.RedactableRecordEntry, lines: Api.RecordTextResponse}> {
        const entry = await Fetchers.get.single_record({name});
        const lines = await Fetchers.get.record_text({name});

        return {entry, lines};
    }

    async function get_puzzle_data(name?: string): Promise<Api.PuzzleObject> {
        const puzzle = await Fetchers.get.single_puzzle({name});
        return puzzle;
    }

    async function get_tale_data(name?: string): Promise<Api.TaleEntry> {
        const {tales} = await Fetchers.get.all_tales({});
        const tale = tales.find(tale => tale.name === name)!;
        return tale;
    }
</script>

{#await news_promise}
    <Loading />
{:then news}
    <div class="view-container" class:reading-mode={current_page.domain === "episodic"} class:solving-mode={current_page.domain === "discover"}>
        <GlassPane
            --background-color={clear_bg ? "none" : undefined}
            --blur-amount={current_page.domain === "episodic" ? "0px" : "10px"}
            title={`fractalthorns.com / ${news.items.filter(item => item.version)[0].version}`}
        >
            {#if current_page.domain === "home"}
                <HomeView />
            {:else if current_page.domain === "image"}
                {#await get_image_data(current_page.name)}
                    <Loading />
                {:then {image, description}}
                    <ImageView {image} {description} />
                {/await}
            {:else if current_page.domain === "sketch"}
                {#await get_sketch_data(current_page.name)}
                    <Loading />
                {:then sketch}
                    <SketchView {sketch} />
                {/await}
            {:else if current_page.domain === "episodic"}
                {#await get_record_data(current_page.record_name)}
                    <Loading />
                {:then {entry, lines}}
                    <RecordView record={entry} text={lines} line_index={current_page.line_index} />
                {:catch}
                    <div class="record-error-container">
                        <em class="record-error-text">this memory is hazy...</em>
                    </div>
                {/await}
            {:else if current_page.domain === "discover"}
                {#await get_puzzle_data(current_page.name)}
                    <Loading />
                {:then puzzle}
                    <PuzzleView {puzzle} />
                {/await}
            {:else if current_page.domain === "tale"}
                {#await get_tale_data(current_page.name)}
                    <Loading />
                {:then tale}
                    <TaleView {tale}></TaleView>
                {/await}
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
