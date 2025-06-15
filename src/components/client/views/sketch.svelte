<script lang="ts">
    import * as Api from "../../../api/api";

    import Keynav from "./keynav.svelte";

    export let sketch: Api.SketchObject;
</script>

<div class="container">
    <div class="info-container">
        <strong class="sketch-name">{sketch?.title}</strong>
        <span class="sketch-date"></span>
    </div>
    <div class="sketch-container">
        <img src={sketch.image_url}>
    </div>
</div>
<Keynav 
    page_left={{domain: "subproject"}}
/>

<style>
    .container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }

    .sketch-container {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
    }

    .info-container {
        position: relative;
        color: rgba(255 255 255 / 75%);
        text-align: right;
        height: 90%;
        padding: 10px;
    }

    .sketch-name {
        font-size: 2rem;
        writing-mode: vertical-rl;
        text-orientation: mixed;
    }

    img {
        filter: drop-shadow(0 0 10px black);
        border-radius: 5px;
        max-height: 95%;
        max-width: 95%;
        object-fit: contain;
    }
</style>