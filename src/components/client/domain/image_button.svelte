<script lang="ts">
    import * as Api from "../../../api/api.ts"
    import * as RecordHelpers from "../../../helpers/record"

    import * as Page from "../page.svelte.ts"

    import PageLink from "../page_link.svelte"
    import ImageButtonPortrait from "./image_button_portrait.svelte"

    let {image}: {
        image: Api.ImageObject,
    } = $props();

    let selected = $derived(Page.state.current.domain === "image" && Page.state.current.name === image.name);
</script>

<div class="image-portrait">
    <PageLink dest={{domain: "image", name: image.name}} cause_layout_switch>
        <div 
            class="portrait-block" 
            style:border-color={RecordHelpers.get_iteration_color(image.canon ?? "")} 
            class:selected
        >
            <ImageButtonPortrait {image} />
        </div>
    </PageLink>
</div>

<style>
    .portrait-block {
        width: 98%;
        border-right: 5px solid rgb(255 255 255 / 50%);
        transition: border-right 0.2s ease-out;
    }

    .portrait-block:hover, .selected {
        border-right: 20px solid rgb(255 255 255 / 50%);
    }
</style>
