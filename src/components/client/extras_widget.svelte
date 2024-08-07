<script lang="ts">
    import {current} from "./page.ts";
    import * as Domain from "../../helpers/domain";

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
    <div class="widget" class:expanded={expanded}>
        {#if expanded}
            <div class="spacer"></div>
            {#if $current.domain === "image"}
                <button class="image-download-button" type="button">↓ download art</button>
            {/if}
            <hr>
        {/if}
        <button class="widget-expand-button" type="button" on:click={toggle_expanded}>...</button>
    </div>
{/if}

<style>
    hr {
        width: 90%;
        color: rgba(0 0 0 / 50%);
        margin: 0;
    }

    .widget {
        position: relative;
        display: flex;
        gap: 10px;
        flex-flow: column nowrap;
        color: white;
        border: 1px solid white;
        border-radius: 5px;
        background-color: rgba(0 0 0 / 50%);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        min-width: 300px;
        max-width: 300px;
        justify-content: center;
        align-items: center;
    }

    .widget.expanded {
        border-top-width: 10px;
    }

    button {
        display: flex;
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
        padding: 0;
        width: 100%;
        height: 100%;
    }
</style>