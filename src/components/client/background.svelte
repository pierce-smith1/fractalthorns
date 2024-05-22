<script lang="ts">
    import p5 from "p5";

    import {Artist} from "../canvas/artist";
    import {current} from "./page.ts";

    import Canvas from "../canvas/canvas.svelte";

    function image_defs() {
        return {
            night: "/assets/images/common/bg-night.png",
            dawn: "/assets/images/common/bg-dawn.png",
            day: "/assets/images/common/bg-day.png",
            dusk: "/assets/images/common/bg-dusk.png",
        };
    }

    type Point = {x: number, y: number};

    class BackgroundArtist extends Artist<ReturnType<typeof image_defs>> {
        state: {[key: string]: any} = {};

        width() {
            return window.innerWidth;
        }

        height() {
            return window.innerHeight;
        }

        image_defs = image_defs;

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
            const now = new Date();
            
            const time = (() => {
                return "dusk";
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

            const bg_image = this.loaded_images[time];

            p5.image(bg_image, 0, 0);
        }

        draw_stars(p5: p5, stars: Array<Point>) {
            p5.stroke(p5.color(255, 255, 255));
            p5.strokeWeight(2);
            for (const star of stars) {
                p5.point(star.x, star.y);
            }
        }
    };

    const artist = new BackgroundArtist();
</script>

<div>
    <Canvas artist={artist}/>
</div>

<style>
    div {
        position: fixed;
        z-index: -10;
        padding: 0;
        margin: 0;
        overflow: hidden;
    }
</style>