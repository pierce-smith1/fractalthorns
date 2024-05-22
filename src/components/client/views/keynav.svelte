<script lang="ts">
    import {onMount} from "svelte";

    import * as Domain from "../../../descriptors/domain";

    import PageLink from '../page_link.svelte';

    export let page_up: Domain.Page;
    export let page_down: Domain.Page;

    onMount(() => {
        window.onkeyup = event => {
            if (["ArrowUp"].includes(event.key)) {
                // @ts-ignore
                document.querySelector(".keynav-up a").click(); // TODO brittle over PageLink
            } 
            
            if (["ArrowDown"].includes(event.key)) {
                // @ts-ignore
                document.querySelector(".keynav-down a").click();
            }

            return () => window.onkeyup = () => {};
        }
    });
</script>

<div class="keynav-container">
    <div class="keynav-up">
        <PageLink dest={page_up} />
    </div>
    <div class="keynav-down">
        <PageLink dest={page_down} />
    </div>
</div>

<style>
    .keynav-container {
        display: none;
    }
</style>