<script lang="ts">
    import {onMount} from "svelte";

    import * as Api from "../../../api";

    export let image: Api.ImageObject;

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
        height: 60px;
        border-radius: 5px 0 0 5px;
        filter: drop-shadow(0 0 2px black);
        background-repeat: no-repeat;
        background-position: center;
    }

    @media (width <= 1200px) {
        .portrait {
            background-color: rgba(0 0 0 / 50%);
        }
    }
</style>