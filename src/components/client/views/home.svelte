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

        font_lekton: p5.Font = null!;
        preload(ctx: p5) {
            ctx.windowResized = () => {
                ctx.resizeCanvas(this.width(), this.height());
            };

            this.font_lekton = ctx.loadFont("/assets/fonts/Lekton-Bold.ttf");
        }

        setup(ctx: p5, canvas: HTMLCanvasElement) {
            super.setup(ctx, canvas);

            ctx.textFont(this.font_lekton);
        }

        draw(ctx: p5) {
            ctx.clear();

            this.draw_julia(ctx);
            this.draw_splash(ctx);
        }

        c = {r: 0, i: 0};
        draw_julia(ctx: p5) {
            ctx.push();

            const scale = ctx.min(
                ctx.min(this.width() / 2, this.height() / 2),
                400
            );

            const t = Date.now() / 9000;

            this.c.r = ctx.sin(t / Math.E) * 0.8;
            this.c.i = ctx.cos(t) * 0.8;

            const iterations = Math.floor(Math.pow(scale, 0.3));
            const fn = Julia.scaled_julia_for(this.c, iterations, scale);

            ctx.stroke(255);
            ctx.noFill();
            ctx.strokeWeight(2);

            MarchingSquares.draw_implicit(fn, 2, ctx);

            ctx.stroke(255, 128);
            ctx.noFill();
            ctx.strokeWeight(1);

            MarchingSquares.draw_implicit(fn, 0.5, ctx);
            MarchingSquares.draw_implicit(fn, 0.8, ctx);

            ctx.pop();
        }

        draw_splash(ctx: p5) {
            const t = Date.now() / 300;

            ctx.push();

            ctx.translate(ctx.width / 2, ctx.height / 2);

            ctx.noStroke();
            ctx.fill(255);
            ctx.textSize(25);

            const splash = `< ${"to dust, and back again"} >`;
            const full_splash_width = ctx.textWidth(splash);

            let running_splash = "";

            for (let i = 0; i < splash.length; i++) {
                const char = splash[i];

                ctx.text(char, -full_splash_width / 2 + ctx.textWidth(running_splash), 170 - ctx.sin(t + i * 100) * 2);
                running_splash += char;
            }

            ctx.pop();
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
