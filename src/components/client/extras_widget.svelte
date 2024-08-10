<script lang="ts">
    import {current} from "./page.ts";
    import * as Domain from "../../helpers/domain";

    import GlassPane from "./style/glass_pane.svelte";

    let expanded = false;

    function toggle_expanded() {
        expanded = !expanded;
    }

    function page_has_extras(page: Domain.Page) {
        switch (page.domain) {
            case "image": return true;
            default: return false;
        }
    }
</script>

{#if page_has_extras($current)}
    <div class="widget-container">
        {#if expanded}
            <GlassPane title="extras">
                <div class="widget-controls-container">
                    <div class="spacer"></div>
                    {#if $current.domain === "image"}
                        <div class="control-container">
                            <div class="control-description">
                                <p>package all art pieces into a zip for download</p>
                                <p>respects the current filters</p>
                            </div>
                            <button class="image-download-button" type="button">download</button>
                        </div>
                    {/if}
                    <hr>
                    <button class="widget-expand-button" type="button" on:click={toggle_expanded}>close</button>
                </div>
            </GlassPane>
        {:else}
            <GlassPane title_bar={false}>
                <button class="widget-expand-button" type="button" on:click={toggle_expanded}>...</button>
            </GlassPane>
        {/if}
    </div>
{/if}

<style>
    .widget-container {
        max-width: 300px;
    }

    hr {
        width: 90%;
        color: rgba(0 0 0 / 50%);
        margin: 0;
    }

    button {
        display: flex;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        min-height: 30px;
        background: none;
        border: 1px solid white;
        color: white;
        border-radius: 5px;
        transition: background-color 0.2s ease-out, color 0.2s ease-out;
        font-size: 16px;
        padding: 2px 10px 2px 10px;
    }

    button:hover {
        color: black;
        background-color: white;
    }

    .widget-expand-button {
        border: none;
        border-radius: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    .widget-controls-container {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .control-container {
        width: 90%;
        display: flex;
        flex-flow: row nowrap;
        gap: 10px;
    }

    .control-description {
        color: rgba(255 255 255 / 75%);
        line-height: 1rem;
    }
</style>