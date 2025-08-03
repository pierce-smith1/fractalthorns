<script lang="ts">
    import {onMount} from "svelte";

    let {image_url}: {
        image_url: string,
    } = $props();

    let visible = $state(false);
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
