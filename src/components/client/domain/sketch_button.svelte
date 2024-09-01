<script lang="ts">
    import * as Api from "../../../api";

    import {current} from "../page";

    import PageLink from "../page_link.svelte";
    import ViewportDeferredImage from "../style/viewport_deferred_image.svelte";

    export let sketch: Api.SketchObject;

    $: selected = $current.domain === "sketch" && $current.name === sketch.name;
</script>

<div class="sketch_button">
    <PageLink dest={{domain: "sketch", name: sketch.name}} cause_layout_switch>
        <div class="button-image" class:selected>
            <ViewportDeferredImage image_url={sketch.thumb_url} />
        </div>
    </PageLink>
</div>

<style>
    .sketch_button {
        align-self: center;
        max-width: 78px;
    }

    .button-image {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 82px;
        min-width: 82px;
        border-radius: 5px;
        transition: 0.3s background-color ease-out;
    }

    .button-image :global(.deferred-image) {
        min-height: 72px;
        max-width: 72px;
        border-radius: 5px;
    }

    .selected, .button-image:hover {
        background-color: rgba(255 255 255 / 50%);
    }
</style>