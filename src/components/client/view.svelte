<script lang="ts">
    import * as Domain from "../../descriptors/domain";

    import {current} from "./page.ts";

    import ImageView from "./views/image.svelte";
    import RecordView from "./views/record.svelte";
    import HomeView from "./views/home.svelte";

    export let page: Domain.Page | undefined = undefined;

    $: current_page = page ?? $current;
</script>

<div class="view-container" class:clear={current_page.domain === "home"}>
    {#if current_page.domain === "home"}
        <HomeView />
    {:else if current_page.domain === "image"}
        <ImageView name={current_page.item} />
    {:else if current_page.domain === "episodic"}
        <RecordView name={current_page.item} />
    {/if}
</div>
<div class="view-title-surrogate">
    <span class="window-title">fractalthorns.com / these games are getting really realistic</span>
</div>

<style>
    .view-container {
        border: 2px solid white;
        border-top-width: 20px;
        border-radius: 5px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        flex-grow: 5;
        overflow-y: auto;
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
        top: 0;
        right: 25px;
        text-align: right;
        width: 1000px;
        padding: 0;
        margin: 0;
        font-size: 14px;
        z-index: 1000;
    }
</style>