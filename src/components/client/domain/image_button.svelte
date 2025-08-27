<script lang="ts">
    import * as Api from "../../../api/api"
    import * as Util from "../../../genericutil"

    import * as Page from "../page.svelte.ts"

    import PageLink from "../page_link.svelte"
    import ViewportDeferredImage from "../style/viewport_deferred_image.svelte"
    import IterationSigil from "./iteration_sigil.svelte"

    let props: {
        image: Api.ImageObject,
    } = $props();

    let selected = $derived(Page.state.current.domain === "image" && Page.state.current.name === props.image.name);
</script>

<div class="image-portrait">
    <PageLink dest={{domain: "image", name: props.image.name}} cause_layout_switch>
        <div class="portrait-block" class:selected>
            <div class="sigil-container" style:background-color={props.image.primary_color}>
                <IterationSigil iteration={props.image.canon} large={true} monochrome=light />
            </div>
            <div class="portrait-container">
                <ViewportDeferredImage image_url={props.image.thumb_url}>
                    <div class="portrait-backsplash"></div>
                    <div class="portrait-content">
                        <p class="title-text">{props.image.title}</p>
                    </div>
                </ViewportDeferredImage>
            </div>
        </div>
    </PageLink>
</div>

<style>
    .portrait-block {
        display: flex;
        flex-flow: row nowrap;
        width: auto;
        height: 40px;
    }

    .sigil-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 40px;
        height: 40px;
        border-radius: 5px 0 0 5px;
    }

    .portrait-container {
        position: relative;
        flex-grow: 2;
        height: 100%;
    }

    .portrait-content {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        height: 40px;
    }

    .portrait-backsplash {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, black 15%, transparent 80%);
    }

    .title-text {
        margin: 0 0 0 5px;
        padding: 0;
        background-color: rgba(0 0 0 / 50%);
        padding: 5px;
        font-size: 1em;
        font-weight: 900;
        z-index: 1;
        transition: all 0.2s ease-out;
        line-height: 1em;
    }

    .selected .title-text, :hover .title-text {
        background-color: white;
        color: black;
    }
</style>
