<script lang="ts">
    import p5 from "p5";
    import {onMount} from "svelte";

    import {Artist} from "./artist";

    export let artist: Artist;
    export let ctx: p5 | undefined = undefined;

    let canvas: HTMLCanvasElement;

    onMount(() => {
        ctx = new p5(p5 => {
            p5.preload = () => artist.preload(p5);
            p5.setup = () => artist.setup(p5, canvas);
            p5.draw = () => artist.draw(p5);
        });

        return () => ctx?.remove();
    },);
</script>

<canvas bind:this={canvas} width={artist.width()} height={artist.height()}></canvas>