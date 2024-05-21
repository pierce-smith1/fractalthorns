<script lang="ts">
    import p5 from "p5";

    import * as RecordModel from "../../models/record";
    import {Artist} from "../canvas/artist";

    import Canvas from "../canvas/canvas.svelte";

    export let record: RecordModel.Model;

    class BackgroundArtist extends Artist<{}> {
        constructor(
            private iteration: string,
        ) { super(); }

        state: {[key: string]: any} = {};

        width = () => window.innerWidth;
        height = () => window.innerHeight;

        image_defs = () => ({});

        preload(p5: p5) {
            super.preload(p5);

            p5.windowResized = () => {
                p5.resizeCanvas(window.innerWidth, window.innerHeight);
            };
        }

        setup(p5: p5, canvas: HTMLCanvasElement) {
            super.setup(p5, canvas);
            
            this.state.ring_count = 40;
            this.state.angles = Array(this.state.ring_count).fill(0).map(n => Math.random() * p5.TWO_PI);
        }

        draw(p5: p5) {
            p5.background("#eee");

            p5.noFill();
            p5.stroke("#ccc");
            p5.strokeWeight(3);
            p5.ellipseMode(p5.CENTER);
            p5.translate(this.width() / 2, this.height() / 2);
            for (let i = 0; i < this.state.ring_count; i ++) {
                p5.rotate(this.state.angles[i]);
                p5.arc(0, 0, i * 100, i * 100, 0, p5.TWO_PI - (p5.PI / 3));
                this.state.angles[i] += 0.00005;
            }

            p5.strokeWeight(1);
            p5.stroke("#dfdfdf");
            for (let i = 0; i < this.state.ring_count * 5; i ++) {
                p5.ellipse(0, 0, i * 20, i * 20);
            }
        }
    };

    const artist = new BackgroundArtist(record.options.iter);
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