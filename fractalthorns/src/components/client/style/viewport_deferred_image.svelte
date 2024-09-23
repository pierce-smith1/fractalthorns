<script lang="ts">
    import {onMount} from "svelte";

    export let image_url: string;

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

<div class="deferred-image" bind:this={portrait_element} style:background-image={visible ? `url(${image_url})` : ""}></div>

<style>
    .deferred-image {
        width: 100%;
        height: 100%;
    }
</style>