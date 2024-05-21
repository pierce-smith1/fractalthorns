<script lang="ts">
    import p5 from "p5";
    import { onMount } from "svelte";

    import { Artist } from "./artist";

    export let artist: Artist<any>;

    let canvas: HTMLCanvasElement;

    onMount(() => {
        new p5(p5 => {
            p5.preload = () => artist.preload(p5);
            p5.setup = () => artist.setup(p5, canvas);
            p5.draw = () => artist.draw(p5);
        });
    });
</script>

<canvas bind:this={canvas} width={artist.width()} height={artist.height()}></canvas>