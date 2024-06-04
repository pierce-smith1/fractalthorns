<script lang="ts">
    import p5 from "p5";
    import {onMount} from "svelte";

    import * as Nav from "../nav";

    import {Artist} from "../../canvas/artist";

    import Canvas from "../../canvas/canvas.svelte";
    import Keynav from "./keynav.svelte";

    function image_defs() {
        return {
            quintic: "/assets/images/common/quintic.png",
        };
    }

    function get_view_width() {
        const width = document.querySelector(".home-artist-container")?.clientWidth ?? 0;
        return width;
    }

    function get_view_height() {
        const height = document.querySelector(".home-artist-container")?.clientHeight ?? 0;
        return height;
    }

    type SphericalPoint = {theta: number, phi: number, theta_velocity: number, phi_velocity: number};
    class HomeArtist extends Artist<ReturnType <typeof image_defs>> {
        width() {
            return get_view_width();
        }

        height() {
            return get_view_height();
        }

        image_defs = image_defs;

        preload(p5: p5) {
            super.preload(p5);

            p5.windowResized = () => {
                console.log(`${this.width()}, ${this.height()}`);
                p5.resizeCanvas(this.width(), this.height());
            };
        }

        points: Array<SphericalPoint> = [];
        setup(p5: p5, canvas: HTMLCanvasElement) {
            super.setup(p5, canvas);

            this.points = Array(150).fill(0).map(_ => ({
                theta: Math.random() * p5.TWO_PI, 
                phi: Math.random() * p5.TWO_PI,
                theta_velocity: Math.random() * 0.002 + 0.0005,
                phi_velocity: Math.random() * 0.002 + 0.0005,
            }));
        }

        draw(p5: p5) {
            p5.clear();

            const center = {x: this.width() / 2, y: this.height() / 2};
            p5.translate(center.x, center.y);

            const r = Math.min(300, this.width() * 0.90, this.height() * 0.90);

            this.points.forEach(point => {
                point.theta += point.theta_velocity;
                point.phi += point.phi_velocity;
            });
            
            const cartesian_points = this.points.map(({theta, phi}) => {
                const x = p5.sin(theta) * p5.sin(phi) * r;
                const y = p5.cos(theta) * r;

                const prominence = p5.abs(p5.sin(phi));

                return {x, y, prominence};
            });

            for (const point of cartesian_points) {
                p5.push();

                p5.stroke(255);
                p5.noFill();

                const angle = -p5.atan2(point.x, point.y)
                p5.translate(point.x, point.y);
                p5.rotate(angle);

                const p = point.prominence;
                const p_sq = p * p;
                const p_cube = p * p * p;

                const spread = p_cube * 10;
                const pointyness = p_sq * 50;
                const height = p_cube * p_cube * p_cube * 50;
                p5.bezier(spread, 0, pointyness / 3, 0, 0, p_cube * 20 / 3, 0, height); 
                p5.bezier(-spread, 0, -pointyness / 3, 0, 0, p_cube * 20 / 3, 0, height); 

                p5.pop();
            }
        }
    };

    const artist = new HomeArtist();
</script>

<div class="home-artist-container">
    <img class="quintic" src="/assets/images/common/thorns.png">
    <p class="splash">testing, testing, one two three</p>

    <div class="canvas-container">
        <Canvas {artist} />
    </div>

    <a class="repo-link" href="https://github.com/pierce-smith1/fractalthorns">
        <img src="/assets/images/common/socials-github.png" />
    </a>
</div>
<Keynav 
    page_right={{domain: "image"}}
/>

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

    .quintic {
        position: relative;
        top: 10px;
    }

    .splash {
        position: relative;
        top: 0;
        font-size: 1.3em;
        padding: 12px 20px 12px 20px;
        border-radius: 10px;
        border: 1px solid rgba(255 255 255 / 50%);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 1;
    }

    .repo-link {
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 10px;
        opacity: 50%;
    }

    * {
        color: white;
        text-align: center;
    }
</style>