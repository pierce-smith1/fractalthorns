<script lang="ts">
    import * as Api from "../../../api/api"

    import * as Page from "../page.svelte.ts"
    import * as Util from "../../../genericutil"

    import PageLink from "../page_link.svelte"
    import ViewportDeferredImage from "../style/viewport_deferred_image.svelte"

    let props: {
        sketch: Api.SketchObject,
    } = $props();

    let selected = $derived(Page.state.current.domain === "sketch" && Page.state.current.name === props.sketch.name);
    let color = $derived(props.sketch.primary_color);
    let text_color = $derived(color
        ? Util.lightness_of_color(color) === "light"
            ? "black"
            : "white"
        : "white"
    );

    let name = $derived(props.sketch.name.replaceAll("-", " "));
</script>

<div class="sketch_button">
    <PageLink dest={{domain: "sketch", name: props.sketch.name}} cause_layout_switch>
        <div class="button-image" class:selected>
            <ViewportDeferredImage image_url={props.sketch.thumb_url}></ViewportDeferredImage>
            <div class="portrait-content" style:background-color={color}>
                <p class="sketch-name" style:color={text_color}>{name}</p>
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
        padding: 5px 0;
    }

    .button-image :global(.deferred-image) {
        position: relative;
        min-height: 72px;
        min-width: 72px;
        border-radius: 5px 5px 0 0;
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
        width: 90%;
        border-radius: 0 0 5px 5px;
        hyphens: manual;
    }

    .sketch-name {
        margin: 0;
        padding: 5px;
        font-size: 0.8em;
        font-weight: 900;
        z-index: 1;
        text-align: center;
    }
</style>
