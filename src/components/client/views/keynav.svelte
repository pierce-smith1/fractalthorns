<script lang="ts">
    import {onMount} from "svelte";

    import * as Domain from "../../../descriptors/domain";

    import PageLink from '../page_link.svelte';

    export let page_up: Domain.Page | undefined = undefined;
    export let page_down: Domain.Page | undefined = undefined;
    export let page_left: Domain.Page | undefined = undefined;
    export let page_right: Domain.Page | undefined = undefined;

    onMount(() => {
        window.onkeydown = event => {
            if (document.activeElement?.tagName?.toLowerCase() === "input") {
                return true;
            }

            // Don't interrupt keyboard shortcuts
            if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
                return true;
            }

            if (["ArrowUp", "w"].includes(event.key)) {
                // @ts-ignore
                document.querySelector(".keynav-up a")?.click(); // TODO brittle over PageLink
            } 
            
            if (["ArrowDown", "s"].includes(event.key)) {
                // @ts-ignore
                document.querySelector(".keynav-down a")?.click();
            }

            if (["ArrowLeft", "a"].includes(event.key)) {
                // @ts-ignore
                document.querySelector(".keynav-left a")?.click();
            }

            if (["ArrowRight", "d"].includes(event.key)) {
                // @ts-ignore
                document.querySelector(".keynav-right a")?.click();
            }
            
            return false;
        };

        return () => window.onkeydown = () => {};
    });
</script>

<div class="keynav-container">
    {#if page_up}
        <div class="keynav-up">
            <PageLink dest={page_up} />
        </div>
    {/if}
    {#if page_down}
        <div class="keynav-down">
            <PageLink dest={page_down} />
        </div>
    {/if}
    {#if page_left}
        <div class="keynav-left">
            <PageLink dest={page_left} />
        </div>
    {/if}
    {#if page_right}
        <div class="keynav-right">
            <PageLink dest={page_right} />
        </div>
    {/if}
</div>

<style>
    .keynav-container {
        display: none;
    }
</style>