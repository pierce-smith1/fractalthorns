<script lang="ts">
    import * as Api from "../../../api/api"

    import * as Page from "../page.svelte.ts"

    import PageLink from "../page_link.svelte"
    import ViewportDeferredImage from "../style/viewport_deferred_image.svelte"

    let props: {
        sketch: Api.SketchObject,
    } = $props();

    let selected = $derived(Page.state.current.domain === "sketch" && Page.state.current.name === props.sketch.name);

    let name = $derived(props.sketch.name.replaceAll("-", " "));
</script>

<div class="sketch_button">
    <PageLink dest={{domain: "sketch", name: props.sketch.name}} cause_layout_switch>
        <div class="button-image" class:selected>
            <ViewportDeferredImage image_url={props.sketch.thumb_url}></ViewportDeferredImage>
            <div class="portrait-content">
                <p class="sketch-name">{name}</p>
            </div>
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
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        min-height: 82px;
        min-width: 82px;
        border-radius: 5px;
        transition: 0.3s background-color ease-out;
        border: 1px solid rgba(255 255 255 / 0%);
        gap: 5px;
        padding-top: 5px;
    }

    .button-image :global(.deferred-image) {
        position: relative;
        min-height: 72px;
        min-width: 72px;
        border-radius: 5px;
    }

    .selected, .button-image:hover {
        background-color: rgba(255 255 255 / 25%);
        border: 1px solid rgba(255 255 255 / 50%);
    }

    .portrait-content {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
    }

    .sketch-name {
        margin: 0;
        padding: 0;
        font-size: 0.8em;
        font-weight: 900;
        z-index: 1;
        text-align: center;
    }
</style>
