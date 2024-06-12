<script lang="ts">
    import p5 from "p5";

    import {Artist} from "../canvas/artist";
    import {current} from "./page.ts";

    import Canvas from "../canvas/canvas.svelte";

    type Point = {x: number; y: number};

    const time = (() => {
        return "dawn";
        const now = new Date();
        const hour = now.getHours();
        if (hour > 22 || hour <= 4) {
            return "night";
        } else if (hour > 4 && hour <= 10) {
            return "dawn";
        } else if (hour > 10 && hour <= 18) {
            return "day";
        } else {
            return "dusk";
        }
    })();

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

            current.subscribe(new_page => {
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
</script>

<div>
    <div
        class="background"
        style:background-image={`url(/assets/images/common/bg-${time}.png)`}
    ></div>
    <div class="canvas">
        <Canvas {artist} />
    </div>
</div>

<style lang="scss">
    .background,
    .canvas {
        position: fixed;
        z-index: -10;
        padding: 0;
        margin: 0;
        // prefer lvw/lvh but it's not totally suppoted yet
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
    }
</style>
