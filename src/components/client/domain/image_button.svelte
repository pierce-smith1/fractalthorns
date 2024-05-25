<script lang="ts">
    import {onMount} from "svelte";

    import * as Image from "../../../descriptors/image";
    import * as Episodic from "../../../descriptors/episodic";

    import {current} from "../page.ts";

    import PageLink from "../page_link.svelte";

    export let image: Image.ClientModel;

    let this_element: Element;
    onMount(() => {
        let scroll_observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    // @ts-ignore
                    entry.target.style = `background-image: url(${image.thumb_url});`;
                }
            }
        });
        scroll_observer.observe(this_element);
    });
</script>

<div class="image-portrait" bind:this={this_element}>
    <PageLink dest={{domain: "image", name: image.name}}>
        <div class="portrait-block" 
            style:border-color={Episodic.get_iteration_color(image.canon ?? "")} 
            class:selected={$current.domain === "image" && $current.name === image.name}
        >
            <div class="portrait"></div>
        </div>
    </PageLink>
</div>

<style>
    .portrait-block {
        width: 100%;
        border-right: 5px solid rgb(255 255 255 / 50%);
        transition: border-right 0.2s ease-out;
    }

    .portrait-block:hover, .selected {
        border-right: 20px solid rgb(255 255 255 / 50%);
    }

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