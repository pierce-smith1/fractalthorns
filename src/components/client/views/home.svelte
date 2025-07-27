<script lang="ts">
    import p5 from "p5";

    import * as Fetchers from "../../../fetchers"
    import * as MarchingSquares from "./graphics/marching_squares.ts"
    import * as Julia from "./graphics/julia.ts"

    import {Artist} from "../../canvas/artist";

    import Canvas from "../../canvas/canvas.svelte";
    import Keynav from "./keynav.svelte";
    import Loading from "../loading.svelte";

    function get_view_width() {
        const width = document.querySelector(".home-artist-container")?.clientWidth ?? 0;
        return width;
    }

    function get_view_height() {
        const height = document.querySelector(".home-artist-container")?.clientHeight ?? 0;
        return height;
    }

    class HomeArtist extends Artist {
        width() {
            return get_view_width();
        }

        height() {
            return get_view_height();
        }

        preload(ctx: p5) {
            ctx.windowResized = () => {
                ctx.resizeCanvas(this.width(), this.height());
            };
        }

        setup(ctx: p5, canvas: HTMLCanvasElement) {
            super.setup(ctx, canvas);
        }

        draw(ctx: p5) {
            ctx.clear();

            ctx.stroke(255);
            ctx.noFill();
            ctx.strokeWeight(1);

            const scale = ctx.min(this.width() / 2, this.height() / 2);
            const speed_divisor = 7000;

            const fn = Julia.scaled_julia_for({
                r: ctx.sin(Date.now() / speed_divisor) / 2,
                i: ctx.cos(Date.now() / speed_divisor * 1.5) / 2,
            }, scale);

            MarchingSquares.draw_implicit(fn, 2, ctx);

            ctx.stroke(128);
            ctx.noFill();
            ctx.strokeWeight(1);

            MarchingSquares.draw_implicit(fn, 0.5, ctx);
        }
    };

    const artist = new HomeArtist();

    let artist_container_element: HTMLDivElement;
    let artist_ctx: p5 | undefined;

    let observing = false;
    const resize_observer = new ResizeObserver(() => artist_ctx?.windowResized?.());
    $: if (artist_container_element && !observing) {
        resize_observer.observe(artist_container_element);
        observing = true;
    }
</script>

<div class="home-artist-container" bind:this={artist_container_element}>
    <img class="quintic" src="/assets/images/common/thorns.png">

    <div class="canvas-container">
        <Canvas {artist} bind:ctx={artist_ctx} />
    </div>

    <div class="socials-container">
        <a class="social-link" href="https://github.com/pierce-smith1/fractalthorns">
            <img src="/assets/images/common/socials-github.png" />
        </a>
        <a class="social-link" href="https://discord.gg/xmTjgPkt3S">
            <img src="/assets/images/common/socials-discord.png" />
        </a>
        <a class="social-link" href="https://www.youtube.com/@berylrose2270">
            <img src="/assets/images/common/socials-youtube.png" />
        </a>
    </div>
</div>
{#await Fetchers.get.single_image({name: undefined})}
    <Loading />
{:then image}
    <Keynav 
        page_right={{domain: "image", name: image.name}}
    />
{/await}

<style>
    .home-artist-container {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .canvas-container {
        position: fixed;
    }

    .socials-container {
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: row nowrap;
        padding: 0 10px;
        gap: 5px;
    }

    .social-link {
        opacity: 30%;
    }

    * {
        color: white;
        text-align: center;
    }
</style>
