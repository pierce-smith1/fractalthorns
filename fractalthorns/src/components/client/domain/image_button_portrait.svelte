<script lang="ts">
    import * as Api from "../../../api";

    import ViewportDeferredImage from "../style/viewport_deferred_image.svelte";

    export let image: Api.ImageObject;
</script>

<div class="portrait">
    <ViewportDeferredImage image_url={image.thumb_url} />
</div>

<style>
    .portrait :global(.deferred-image) {
        display: block;
        box-sizing: border-box;
        min-width: 98%;
        max-width: 98%;
        height: 60px;
        border-radius: 5px 0 0 5px;
        filter: drop-shadow(0 0 2px black);
        background-repeat: no-repeat;
        background-position: center;
    }

    @media (width <= 1200px) {
        .portrait :global(.deferred-image) {
            background-color: rgba(0 0 0 / 50%);
        }
    }
</style>