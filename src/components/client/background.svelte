<script lang="ts">
    import p5 from "p5";

    import {Artist} from "../canvas/artist";
    import * as Page from "./page.ts";

    import Canvas from "../canvas/canvas.svelte";

    type Point = {x: number; y: number};

    class BackgroundArtist extends Artist<{}> {
        state: {[key: string]: any} = {};

        width() {
            return window.innerWidth;
        }

        height() {
            return window.innerHeight;
        }

        image_defs = () => ({});

        preload(p5: p5) {
            super.preload(p5);

            p5.windowResized = () => {
                p5.resizeCanvas(window.innerWidth, window.innerHeight);
            };
        }

        domain: string | undefined;
        setup(p5: p5, canvas: HTMLCanvasElement) {
            super.setup(p5, canvas);

            Page.current.subscribe(new_page => {
                this.domain = new_page?.domain;
            });

            p5.frameRate(1);
        }

        draw(p5: p5) {
            this.draw_stars(p5, [
                /* TODO */
            ]);
        }

        draw_stars(p5: p5, stars: Array<Point>) {
            p5.stroke(p5.color(255, 255, 255));
            for (const star of stars) {
                p5.point(star.x, star.y);
            }
        }
    }

    const artist = new BackgroundArtist();

    type RgbColor = {r: number, g: number, b: number};
    type HslColor = {h: number, s: number, l: number};
    // Algorithm from https://www.rapidtables.com/convert/color/rgb-to-hsl.html
    function rgb_to_hsl(color: RgbColor): HslColor {
        const ri = color.r / 255;
        const gi = color.g / 255;
        const bi = color.b / 255;

        const cmax = Math.max(ri, gi, bi);
        const cmin = Math.min(ri, gi, bi);

        const delta = cmax - cmin;

        const h = (() => {
            if (delta === 0) return 0;
            if (cmax === ri) return 60 * (((gi - bi) / delta) % 6);
            if (cmax === gi) return 60 * (((bi - ri) / delta) + 2);
            return 60 * (((ri - gi) / delta) + 4);
        })();

        const li = (cmax + cmin) / 2;

        const si = delta === 0 
            ? 0
            : delta / (1 - Math.abs(2 * li - 1));
            
        const l = Math.round(li * 100);
        const s = Math.round(si * 100);

        return {h, s, l};
    } 

    function color_string_to_rgb(str: string): RgbColor {
        const r = parseInt(str.substring(1, 3), 16);
        const g = parseInt(str.substring(3, 5), 16);
        const b = parseInt(str.substring(5, 7), 16);
        return {r, g, b};
    }

    function hsl_to_css_filters(color: HslColor): string {
        const hue_rotate = `hue-rotate(${color.h}deg)`;
        const saturate = `saturate(${color.s}%)`;
        const brighten = `brightness(${color.l * 3}%)`;

        return `${hue_rotate} ${saturate} ${brighten}`;
    }

    function colorize_filters(color_string: string): string {
        const rgb = color_string_to_rgb(color_string);
        const hsl = rgb_to_hsl(rgb);
        const filters = hsl_to_css_filters(hsl);
        return filters;
    }

    let current_theme = Page.default_theme;
    Page.theme_promise.subscribe(theme_promise => {
        theme_promise.then(theme => current_theme = theme);
    })
</script>

<div>
    <div class="background" style:background-image={`url(/assets/images/common/dodecas.png)`} style:filter={colorize_filters(current_theme.primary_color)}></div>
    <div class="background bg-overlay" style:background-image={`url(/assets/images/common/dodecas-overlay.png)`} style:filter={colorize_filters(current_theme.secondary_color)}></div>
    
    <!--
    <div class="background" style:background-color={current_theme.primary_color}></div>
    -->

    <div class="canvas">
        <Canvas {artist} />
    </div>
</div>

<style>
    .background, .canvas {
        position: fixed;
        z-index: -10;
        padding: 0;
        margin: 0;
        width: 100vw;
        height: 100vh;
        width: 100lvw;
        height: 100lvh;
    }

    .background {
        background-repeat: no-repeat;
        background-position: center center;
        background-attachment: fixed;
        background-size: cover;
        transition: 5s filter ease-in-out 1s;
    }
</style>
