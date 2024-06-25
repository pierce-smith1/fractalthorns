<script lang="ts">
    import * as Image from "../../../descriptors/public/image";
    import * as Episodic from "../../../descriptors/public/episodic";

    import {current} from "../page.ts";

    import PageLink from "../page_link.svelte";
    import Portrait from "./image_button_portrait.svelte";

    export let image: Image.ImageResponse;
</script>

<div class="image-portrait">
    <PageLink dest={{domain: "image", name: image.name}} cause_layout_switch>
        <div class="portrait-block" style:border-color={Episodic.get_iteration_color(image.canon ?? "")} class:selected={$current.domain === "image" && $current.name === image.name}>
            <Portrait {image} />
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
</style>