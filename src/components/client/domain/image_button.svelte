<script lang="ts">
    import * as Image from "../../../descriptors/image";
    import * as Episodic from "../../../descriptors/episodic";

    import PageLink from "../page_link.svelte";

    export let image: Image.ClientModel;
</script>

<div class="image-portrait">
    <PageLink dest={({domain: "image", item: image.name})}>
        <img class="portrait" src={image.thumb_url} style:border-color={Episodic.get_iteration_color(image.canon ?? "")}>
    </PageLink>
</div>

<style>
    img {
        box-sizing: border-box;
        border-radius: 5px;
        max-width: 100%;
        border-left: 5px solid rgb(255 255 255 / 50%);
    }
</style>