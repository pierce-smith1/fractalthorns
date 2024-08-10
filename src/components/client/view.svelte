<script lang="ts">
    import * as Domain from "../../helpers/domain.ts";
    import * as Fetchers from "../../fetchers";

    import {current} from "./page.ts";

    import ImageView from "./views/image.svelte";
    import RecordView from "./views/record.svelte";
    import HomeView from "./views/home.svelte";
    import SubprojectView from "./views/subproject.svelte";
    import Loading from "./loading.svelte";
    import GlassPane from "./style/glass_pane.svelte";

    export let page: Domain.Page | undefined = undefined;

    $: current_page = page ?? $current;

    let news_promise = Fetchers.get.all_news({});
</script>

{#await news_promise}
    <Loading />
{:then news}
    <div class="view-container" class:clear={current_page.domain === "home"} class:reading-mode={current_page.domain === "episodic"}>
        <GlassPane title={`fractalthorns.com / ${news.items[0].version}`}>
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
        </GlassPane>
    </div>
{/await}

<style>
    .view-container {
        flex-grow: 2;
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

    @media (width <= 1200px) {
        .view-container {
            height: 200%;
        }
    }
</style>