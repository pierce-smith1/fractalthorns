<script lang="ts">
    import jszip from "jszip";

    import GlassButton from "../../style/glass_button.svelte";

    import {nav_state, get_visible_items} from "../../nav.ts";
    import {current} from "../../page.ts";
    import Loading from "../../loading.svelte";

    let currently_downloading = false;
    function download_visible_images() {
        if (currently_downloading) {
            return;
        }

        currently_downloading = true;

        if ($current.domain !== "image") {
            return;
        }

        const visible_images = get_visible_items($nav_state)
            .filter(item => item.domain === "image")
            .map(item => item.image);

        const zip_file = new jszip();
        const images_folder = zip_file.folder("fractalthorns")!;

        const zip_load_promises = [];
        
        zip_load_promises.push(fetch("/license.txt")
            .then(response => response.text())
            .then(data => images_folder.file("license.txt", data)));

        for (const image of visible_images) {
            zip_load_promises.push(fetch(image.image_url)
                .then(response => response.arrayBuffer())
                .then(data => images_folder.file(`${image.ordinal}-${image.name}.png`, data)));
        }

        Promise.all(zip_load_promises)
            .then(() => zip_file.generateAsync({type: "blob"})
            .then(data => {
                const object_url = URL.createObjectURL(data);
                const download_anchor = document.createElement("a");

                download_anchor.style.display = "none";
                download_anchor.href = object_url;
                download_anchor.download = `fractalthorns-art.zip`;
                
                document.body.append(download_anchor);

                download_anchor.click();
                currently_downloading = false;

                // TODO if we can find a safe time to unregister this url and 
                // destroy this anchor, we should do so
            }));
    }
</script>

<div class="control-container">
    <div class="control-description">
        <p>package all art pieces into a zip for download</p>
        <p>respects the current filters</p>
    </div>
    <GlassButton on:click={download_visible_images}>
        {#if currently_downloading}
            <Loading />
        {:else}
            download
        {/if}
    </GlassButton>
</div>

<style>
    .control-container {
        width: 90%;
        display: flex;
        flex-flow: row nowrap;
        gap: 10px;
    }

    .control-description {
        color: rgba(255 255 255 / 75%);
        line-height: 1rem;
    }
</style>