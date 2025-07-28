<script lang="ts">
    import p5 from "p5";

    import * as Fetchers from "../../../fetchers"
    import * as MarchingSquares from "./graphics/marching_squares.ts"
    import * as Julia from "./graphics/julia.ts"
    import * as Page from "../page"

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

        rune_points: Array<Array<Array<[number, number]>>> = [];
        rune_colors: Array<{primary: p5.Color, secondary: p5.Color}> = [];
        rune_groupings: Array<{group: number, pip: number}> = [];
        setup(ctx: p5, canvas: HTMLCanvasElement) {
            super.setup(ctx, canvas);

            ctx.textFont(this.font_lekton);

            this.rune_points = [
                [
                    [[0, 5], [0, 8], [6, 8], [6, 0], [2, 0], [2, 7], [8, 7]],
                ],
                [
                    [[0, 8], [0, 0], [4, 8], [4, 0], [8, 8], [8, 0]],
                ],
                [
                    [[0, 8], [3, 0], [6, 8], [8, 8], [8, 4], [6, 4]],
                ],
                [
                    [[0, 8], [0, 5], [3, 5], [5, 8], [8, 8], [8, 5], [3, 0]],
                ],
                [
                    [[1, 8], [6, 0], [8, 0], [8, 8], [6, 8], [2, 0], [0, 2]],
                ],
                [
                    [[0, 0], [8, 0], [1, 4], [8, 4], [2, 8]],
                ],
                [
                    [[4, 0], [0, 0], [0, 8], [8, 8], [8, 2], [6, 2], [6, 0], [8, 0]],
                ],
                [
                    [[4, 8], [4, 0], [7, 4], [0, 4]],
                    [[2, 1], [2, 7]],
                ],
                [
                    [[2, 8], [0, 8], [0, 0], [5, 0], [5, 4], [3, 4], [3, 1], [8, 1], [8, 8], [6, 8]],
                ],
                [
                    [[0, 0], [0, 2], [2, 2]],
                    [[2, 0], [2, 8], [8, 8], [8, 0], [4, 0]],
                ],
                [
                    [[0, 8], [4, 0], [8, 8], [5, 8], [8, 3]],
                ],
                [
                    [[0, 0], [6, 0], [6, 8], [0, 8], [0, 4], [8, 4]],
                ],
                [
                    [[4, 0], [4, 8], [7, 8], [7, 4], [1, 4]],
                ],
                [
                    [[0, 8], [0, 6], [4, 6], [4, 8], [8, 8], [8, 1], [2, 1], [2, 3], [4, 3], [4, 1]]
                ],
                [
                    [[4, 8], [8, 8], [8, 0], [0, 0], [0, 6], [6, 6], [6, 2], [2, 2], [2, 6]],
                ],
                [
                    [[8, 0], [0, 0], [3, 8], [8, 8], [8, 4], [3, 4], [0, 8]],
                ],
                [
                    [[0, 1], [3, 1], [3, 4], [1, 4], [1, 8], [7, 8], [7, 0]],
                ],
                [
                    [[0, 8], [2, 8], [1, 4], [5, 8], [3, 0], [8, 5]],
                ],
                [
                    [[0, 8], [0, 5], [4, 5], [4, 8], [8, 8], [8, 0], [2, 0], [2, 4]],
                ],
                [
                    [[2, 8], [0, 8], [0, 0], [4, 0], [4, 8], [8, 8]],
                ],
            ];

            this.rune_colors = [
                {primary: ctx.color("#0d4f9c"), secondary: ctx.color("#647fc8")},
                {primary: ctx.color("#a15310"), secondary: ctx.color("#c97a08")},
                {primary: ctx.color("#1d82b6"), secondary: ctx.color("#12a1cc")},
                {primary: ctx.color("#9bacdc"), secondary: ctx.color("#59771f")},
                {primary: ctx.color("#5ad6d4"), secondary: ctx.color("#5652e7")},
                {primary: ctx.color("#ffffff"), secondary: ctx.color("#ffeebb")},
                {primary: ctx.color("#00ea42"), secondary: ctx.color("#352929")},
                {primary: ctx.color("#c01e1c"), secondary: ctx.color("#866bca")},
                {primary: ctx.color("#b62c37"), secondary: ctx.color("#ffffff")},
                {primary: ctx.color("#abdbe9"), secondary: ctx.color("#ffffff")},
                {primary: ctx.color("#fc00b4"), secondary: ctx.color("#fd01c8")},
                {primary: ctx.color("#077d86"), secondary: ctx.color("#57375e")},
                {primary: ctx.color("#d0bdaa"), secondary: ctx.color("#e1cbbc")},
                {primary: ctx.color("#aa5250"), secondary: ctx.color("#37457e")},
                {primary: ctx.color("#026ed1"), secondary: ctx.color("#0055a2")},
                {primary: ctx.color("#a6aed3"), secondary: ctx.color("#314027")},
                {primary: ctx.color("#d3d322"), secondary: ctx.color("#7589da")},
                {primary: ctx.color("#1618a0"), secondary: ctx.color("#c01e1c")},
                {primary: ctx.color("#d0805a"), secondary: ctx.color("#e88038")},
                {primary: ctx.color("#375a97"), secondary: ctx.color("#548f35")},
            ];

            this.rune_groupings = [
                {group: 1, pip: 1},
                {group: 4, pip: 1},
                {group: 3, pip: 1},
                {group: 3, pip: 2},
                {group: 4, pip: 2},
                {group: 4, pip: 3},
                {group: 1, pip: 2},
                {group: 2, pip: 1},
                {group: 2, pip: 2},
                {group: 4, pip: 4},
                {group: 2, pip: 3},
                {group: 1, pip: 3},
                {group: 1, pip: 4},
                {group: 3, pip: 3},
                {group: 3, pip: 4},
                {group: 1, pip: 5},
                {group: 2, pip: 4},
                {group: 2, pip: 5},
                {group: 4, pip: 5},
                {group: 3, pip: 5},
            ];
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
            const julia = Julia.scaled_julia_for(this.c, iterations, scale);

            ctx.stroke(255);
            ctx.noFill();
            ctx.strokeWeight(2);

            let rune_grabbed = false;
            for (let i = 0; i < this.rune_points.length; i++) {
                ctx.push();

                ctx.translate(ctx.width / 2, ctx.height / 2);

                const r = 400;
                const theta = ctx.map(i, 0, this.rune_points.length, 0, ctx.QUARTER_PI);

                const x = r * ctx.cos(theta);
                const y = r * ctx.sin(theta);
                const z = Julia.scaled_julia_for(this.c, 3, scale)(x, y);

                const z_r = Math.sqrt(z.r * z.r + z.i * z.i);
                const z_theta = ctx.atan2(z.i, z.r);

                function squeeze(value: number, target: number) {
                    return Math.sign(value) * ctx.pow(ctx.abs(value / target), 1/10) * target;
                }

                const final_x = squeeze(z_r, r) * ctx.cos(z_theta);
                const final_y = squeeze(z_r, r) * ctx.sin(z_theta);

                ctx.noStroke();
                ctx.fill(255);

                this.draw_rune({i,x: final_x, y: final_y, scale: 1.5, ctx});

                ctx.pop();
            }

            const julia_magnitude = (x: number, y: number) => Julia.complex_magnitude(julia(x, y));

            MarchingSquares.draw_implicit(julia_magnitude, 2, ctx);

            ctx.stroke(255, 128);
            ctx.noFill();
            ctx.strokeWeight(1);

            MarchingSquares.draw_implicit(julia_magnitude, 0.5, ctx);
            MarchingSquares.draw_implicit(julia_magnitude, 0.8, ctx);

            ctx.pop();
        }

        draw_splash(ctx: p5) {
            const t = Date.now() / 500;
            const splash_y_offset = 200;
            const splash_box_padding = 35;

            const splash = `< ${"oh man i am not too good with the computer"} >`;

            ctx.push();

            ctx.translate(ctx.width / 2, ctx.height / 2);

            const text_size = ctx.min(25, ctx.min(ctx.width, ctx.height) / 25);
            ctx.textSize(text_size);

            const full_splash_width = ctx.textWidth(splash);

            ctx.push();

            ctx.noStroke();
            ctx.fill(255, 200);

            ctx.rect(
                -full_splash_width / 2 - splash_box_padding,
                splash_y_offset - splash_box_padding,
                full_splash_width + splash_box_padding * 2,
                splash_box_padding * 1.6,
                20
            );

            ctx.pop();

            ctx.noStroke();
            ctx.fill(0, 220);

            let running_splash = "";

            for (let i = 0; i < splash.length; i++) {
                const char = splash[i];

                const char_cycle = ctx.sin(t + i * 100);

                ctx.text(
                    char,
                    -full_splash_width / 2 + ctx.textWidth(running_splash),
                    splash_y_offset - (Math.sign(char_cycle) * (ctx.abs(char_cycle) ** (1/3)) * 2)
                );
                running_splash += char;
            }

            ctx.pop();
        }

        grabbed_rune: number | null = null;
        draw_rune(opts: {i: number, x: number, y: number, scale: number, ctx: p5}): void {
            const rune_grab_close_distance = 60;
            const rune_grab_far_distance = 120;
            const rune_grab_length_ms = 2500;

            const {i, x, y, scale , ctx} = opts;

            const point_groups = this.rune_points[i];

            const mouse_x = ctx.mouseX - ctx.width / 2;
            const mouse_y = ctx.mouseY - ctx.height / 2;
            let mouse_t = ctx.map(ctx.dist(x, y, mouse_x, mouse_y), rune_grab_close_distance, rune_grab_far_distance, 1.0, 0, true);

            if (this.grabbed_rune == null && mouse_t > 0.5) {
                this.grabbed_rune = i;

                // If we hold on to the same rune for long enough...
                setTimeout(() => {
                    if (this.grabbed_rune === i) {
                        Page.set_home_theme({
                            primary_color: this.rune_colors[i].primary.toString("#rrggbb"),
                            secondary_color: this.rune_colors[i].secondary.toString("#rrggbb"),
                        });

                        // Dumbass hack to force background to update
                        // TODO: The theme should probably just be a global store instead
                        // of a store derived from page state
                        Page.current.update(current => ({...current}));
                    }
                }, rune_grab_length_ms);
            }

            if (this.grabbed_rune !== i) {
                mouse_t = 0;
            }

            if (this.grabbed_rune === i && mouse_t <= 0.5) {
                this.grabbed_rune = null;
            }

            ctx.push();

            ctx.noFill();
            ctx.stroke(ctx.lerpColor(
                ctx.color(255, 128),
                this.rune_colors[i].primary,
                mouse_t,
            ));
            ctx.strokeWeight(ctx.map(mouse_t, 0, 1.0, 1.0, 2.0));
            ctx.translate(x, y);

            const scale_boost = mouse_t ** 3 + 1;
            const final_scale = scale * scale_boost;

            for (const points of point_groups) {
                for (let i = 1; i < points.length; i++) {
                    const prev_point = points[i - 1];
                    const this_point = points[i];

                    ctx.line(
                        (prev_point[0] - 4) * final_scale,
                        (prev_point[1] - 4) * final_scale,
                        (this_point[0] - 4) * final_scale,
                        (this_point[1] - 4) * final_scale);
                }
            }

            if (this.grabbed_rune === i) {
                const pips_margin_angle = ctx.PI / 16;

                const group_info = this.rune_groupings[i];

                for (let group_i = 0; group_i < 4; group_i++) {
                    const group_start_theta = ctx.PI + pips_margin_angle + (group_i * ctx.HALF_PI);
                    const group_end_theta = (ctx.PI + ctx.HALF_PI) - pips_margin_angle + (group_i * ctx.HALF_PI);

                    for (let pip_i = 0; pip_i < 5; pip_i++) {
                        const pip_theta = ctx.map(pip_i, 0, 5, group_start_theta, group_end_theta);

                        ctx.push();

                        ctx.strokeWeight(1);
                        ctx.stroke(255, 128);

                        if (group_info.group === group_i + 1 && group_info.pip === pip_i + 1) {
                            ctx.strokeWeight(2);
                            ctx.stroke(this.rune_colors[i].primary);
                        }

                        const pip_length = ctx.map(mouse_t, 0.5, 1.0, 0, 10);
                        const pip_offset = 40;

                        ctx.rotate(pip_theta);
                        ctx.line(pip_offset, 0, pip_offset + pip_length, 0);

                        ctx.pop();
                    }
                }
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
