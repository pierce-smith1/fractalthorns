<script lang="ts">
    import {onMount} from "svelte";

    import * as Image from "../../../descriptors/image";

    export let image: Image.ClientModel;

    let visible = false;
    let portrait_element: Element;
    onMount(() => {
        let scroll_observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    visible = true;
                }
            }
        });
        scroll_observer.observe(portrait_element);
    });
</script>

<div class="portrait" bind:this={portrait_element} style:background-image={visible ? `url(${image.thumb_url})` : ""}></div>

<style>
    .portrait {
        display: block;
        box-sizing: border-box;
        min-width: 97%;
        max-width: 97%;
        height: 45px;
        border-radius: 5px 0 0 5px;
        filter: drop-shadow(0 0 2px black);
    }
</style>