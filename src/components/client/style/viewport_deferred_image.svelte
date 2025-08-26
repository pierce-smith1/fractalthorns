<script lang="ts">
    import * as Svelte from "svelte";

    let props: {
        image_url: string,
        children: Svelte.Snippet,
    } = $props();

    let visible = $state(false);
    let portrait_element: Element;

    Svelte.onMount(() => {
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

<div class="deferred-image" bind:this={portrait_element} style:background-image={visible ? `url(${props.image_url})` : ""}>
    {@render props.children()}
</div>

<style>
    .deferred-image {
        background-size: cover;
        background-position: right;
    }
</style>
