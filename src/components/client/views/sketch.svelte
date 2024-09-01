<script lang="ts">
    import * as Api from "../../../api";

    import Keynav from "./keynav.svelte";

    export let sketch: Api.SketchObject | undefined;
    $: this_sketch = sketch!;
</script>

<div class="container">
    <img src={this_sketch.sketch_image_url}>
</div>
<Keynav 
    page_left={{domain: "subproject"}}
/>

<style>
    .container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }

    img {
        filter: drop-shadow(0 0 10px black);
        border-radius: 5px;
        max-height: 95%;
        max-width: 95%;
        object-fit: contain;
    }
</style>