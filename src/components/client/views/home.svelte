<script lang="ts">
    import p5 from "p5";

    import * as Fetchers from "../../../fetchers"
    import * as MarchingSquares from "./graphics/marching_squares.ts"
    import * as Julia from "./graphics/julia.ts"
    import * as Page from "../page.svelte.ts"
    import * as Theme from "../theme.svelte.ts"

    import {Artist} from "../../canvas/artist";

    import Canvas from "../../canvas/canvas.svelte";
    import Keynav from "./keynav.svelte";
    import Loading from "../loading.svelte";

    $effect(() => {
        Theme.save_rune_i(Theme.rune.i);
    });

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

        splash_font: p5.Font = null!;

        preload(ctx: p5) {
            ctx.windowResized = () => {
                ctx.resizeCanvas(this.width(), this.height());
            };

            this.splash_font = ctx.loadFont("/assets/fonts/Agave-Regular.ttf");
        }

        quintic_points: Array<Array<[number, number]>> = [];
        rune_points: Array<Array<Array<[number, number]>>> = [];
        rune_groupings: Array<{group: number, pip: number}> = [];

        last_held_rune_i: number | null = null;
        last_held_rune_change_time = 0;
        rune_transition_time_ms = 2500;

        splash_text: string | null = null;
        splash_y_offset = 170;
        splash_text_actual_width: number | null = null;
        splash_loaded = false;

        setup(ctx: p5, canvas: HTMLCanvasElement) {
            super.setup(ctx, canvas);

            ctx.textFont(this.splash_font);

            this.quintic_points = [
                [[8, 9], [0, 1], [1, 4], [0, 6], [2, 5], [2, 8], [3, 6], [5, 8]],
                [[0, -1], [8, 7], [7, 4], [8, 2], [6, 3], [6, 0], [5, 2], [3, 0]],
            ];

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

            Fetchers.get.current_splash({}).then(result => {
                this.splash_text = result.splash?.text ?? null;
                this.splash_loaded = true;
            });

            this.set_rune(Theme.rune.i ?? null);
            this.last_held_rune_change_time = 0;
        }

        draw(ctx: p5) {
            ctx.clear();

            this.draw_julia(ctx);
            this.draw_splash(ctx);
            this.draw_logo(ctx);
            this.check_rune_reset(ctx);
        }

        c = {r: 0, i: 0};
        draw_julia(ctx: p5) {
            ctx.push();

            // Clip away a rectangle for the splash to sit over
            // @ts-ignore
            ctx.clip(() => {
                ctx.push();

                ctx.translate(ctx.width / 2, ctx.height / 2 + this.splash_y_offset);

                ctx.rectMode(ctx.CENTER);
                ctx.rect(0, 0, this.splash_text_actual_width ?? 0 * 1.5, 40);

                ctx.pop();
            }, {invert: true});

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
            if (!this.splash_loaded) {
                return;
            }

            const t = Date.now() / 500;

            const splash_text = (this.splash_text ?? "...then there was silence").toLocaleLowerCase().trim();
            const splash = `[ ${splash_text} ]`;

            ctx.push();

            ctx.translate(ctx.width / 2, ctx.height / 2);

            const text_size = ctx.min(25, ctx.min(ctx.width, ctx.height) / 25);
            ctx.textSize(text_size);

            // calling textWidth on the whole string is what we should be doing here,
            // but for some reason the sequences "fi" and "fl" cause inaccuracies
            // in the result of textWidth.
            // Further research is seriously needed, but for now, we just calculate
            // the text size linearly by the width of one character.
            //const full_splash_width = ctx.textWidth(splash);

            const full_splash_width = ctx.textWidth("a") * splash.length;
            this.splash_text_actual_width = full_splash_width;

            ctx.noStroke();
            ctx.fill(255, this.splash_text ? 220 : 120);

            for (let i = 0; i < splash.length; i++) {
                const char = splash[i];

                const char_cycle = ctx.sin(t + i * 100);
                const x_off = ctx.map(i, 0, splash.length, 0, full_splash_width);

                ctx.text(
                    char,
                    -full_splash_width / 2 + x_off,
                    this.splash_y_offset + 4 - (Math.sign(char_cycle) * (ctx.abs(char_cycle) ** (1/3)) * (this.splash_text ? 2 : 0.5))
                );
            }

            ctx.pop();
        }

        grabbed_rune_i: number | null = null;
        rune_grab_timer: number | null = null;
        draw_rune(opts: {i: number, x: number, y: number, scale: number, ctx: p5}): void {
            const rune_grab_close_distance = 60;
            const rune_grab_far_distance = 120;
            const rune_grab_length_ms = 2500;

            const {i, x, y, scale , ctx} = opts;

            const mouse_x = ctx.mouseX - ctx.width / 2;
            const mouse_y = ctx.mouseY - ctx.height / 2;
            let mouse_t = ctx.map(ctx.dist(x, y, mouse_x, mouse_y), rune_grab_close_distance, rune_grab_far_distance, 1.0, 0, true);

            if (this.grabbed_rune_i == null && mouse_t > 0.5) {
                this.grabbed_rune_i = i;

                if (this.rune_grab_timer) {
                    clearTimeout(this.rune_grab_timer);
                }

                // If we hold on to the same rune for long enough...
                // @ts-ignore
                this.rune_grab_timer = setTimeout(() => {
                    if (this.grabbed_rune_i === i && this.last_held_rune_i !== i) {
                        this.set_rune(i);
                    }
                }, rune_grab_length_ms);
            }

            if (this.grabbed_rune_i !== i) {
                mouse_t = 0;
            }

            if (this.grabbed_rune_i === i && mouse_t <= 0.5) {
                this.grabbed_rune_i = null;
            }

            ctx.push();

            ctx.noFill();
            ctx.stroke(ctx.lerpColor(
                ctx.color(255, 128),
                ctx.color(Theme.rune_colors[i].primary_color),
                mouse_t,
            ));
            ctx.strokeWeight(ctx.map(mouse_t, 0, 1.0, 1.0, 2.0));
            ctx.translate(x, y);

            const scale_boost = mouse_t ** 3 + 1;
            const final_scale = scale * scale_boost;

            this.draw_rune_shape(i, final_scale, 0, ctx);

            if (this.grabbed_rune_i === i) {
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
                            ctx.stroke(ctx.color(Theme.rune_colors[i].primary_color));
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

        logo_rune_i: number | null = null;
        draw_logo(ctx: p5) {
            function sine_interp(t: number, pow: number = 1) {
                return -ctx.cos(ctx.PI * (t ** pow)) / 2 + 0.5;
            }

            ctx.push();

            ctx.translate(ctx.width / 2, ctx.height / 2);
            ctx.imageMode(ctx.CENTER);

            let size = 20;
            let wiggle = 3;
            let line_alpha = 255;
            let rotation = 0;

            const ms_since_change = ctx.min(Date.now() - this.last_held_rune_change_time, this.rune_transition_time_ms);

            if (ms_since_change < this.rune_transition_time_ms / 2) {
                const t = ctx.map(ms_since_change, 0, this.rune_transition_time_ms / 2, 1, 0);

                size = sine_interp(t, 3) * 20;
                line_alpha = sine_interp(t, 10) * 255;
                wiggle = sine_interp(t, 10) * 3;
                rotation = sine_interp(t, 1/2) * ctx.TWO_PI;
            } else {
                this.logo_rune_i = this.last_held_rune_i;

                const t = ctx.map(ms_since_change, this.rune_transition_time_ms / 2, this.rune_transition_time_ms, 0, 1);

                size = sine_interp(t, 3) * 20;
                line_alpha = sine_interp(t, 10) * 255;
                wiggle = sine_interp(t, 10) * 3;
                rotation = sine_interp(t, 3) * ctx.TWO_PI;
            }

            ctx.rotate(rotation);

            ctx.noFill();
            ctx.stroke(255, line_alpha);
            ctx.strokeWeight(this.logo_rune_i != null ? 16 : 13);
            this.draw_rune_shape(this.logo_rune_i, size, wiggle, ctx);

            ctx.stroke(255, 255 - line_alpha);
            ctx.strokeWeight(2);
            this.draw_rune_constellation(this.logo_rune_i, size, wiggle, ctx);

            ctx.pop();
        }

        draw_rune_shape(rune_i: number | null, scale: number, wiggle_scale: number, ctx: p5) {
            ctx.strokeCap(ctx.PROJECT);
            ctx.strokeJoin(ctx.MITER);

            for (const points of this.get_logo_rune_points(rune_i, scale, wiggle_scale, ctx)) {
                ctx.beginShape();

                for (const [x, y] of points) {
                    ctx.vertex(x, y);
                }

                ctx.endShape();
            }
        }

        draw_rune_constellation(rune_i: number | null, scale: number, wiggle_scale: number, ctx: p5) {
            for (const points of this.get_logo_rune_points(rune_i, scale, wiggle_scale, ctx)) {
                for (const [x, y] of points) {
                    ctx.point(x, y);
                }
            }
        }

        get_logo_rune_points(rune_i: number | null, scale: number, wiggle_scale: number, ctx: p5) {
            const t = Date.now() / 1000;

            const point_groups = rune_i == null
                ? this.quintic_points
                : this.rune_points[rune_i];

            const logo_points: Array<Array<[number, number]>> = [];

            for (const points of point_groups) {
                const logo_point_group: Array<[number, number]> = [];

                for (const point of points) {
                    const x = (point[0] - 4) * scale + (ctx.cos(t + point[0] + point[1]) * wiggle_scale);
                    const y = (point[1] - 4) * scale + (ctx.sin(t + point[1] + point[1]) * wiggle_scale);

                    logo_point_group.push([x, y]);
                }

                logo_points.push(logo_point_group);
            }

            return logo_points;
        }

        set_rune(rune_i: number | null) {
            this.last_held_rune_i = rune_i;
            this.last_held_rune_change_time = Date.now();

            Theme.rune.i = rune_i ?? undefined;

            Page.state.current = {domain: "home", rune_i: rune_i ?? undefined};
        }

        check_rune_reset(ctx: p5) {
            if (this.last_held_rune_i == null) {
                return;
            }

            if (Date.now() - this.last_held_rune_change_time < this.rune_transition_time_ms) {
                return;
            }

            const reactive_region_size = 120;

            const mouse_x = ctx.mouseX - ctx.width / 2;
            const mouse_y = ctx.mouseY - ctx.height / 2;

            const mouse_in_region = ctx.dist(mouse_x, mouse_y, 0, 0) < reactive_region_size;

            if (mouse_in_region && ctx.mouseIsPressed) {
                this.set_rune(null);
            }
        }
    };


    const artist = new HomeArtist();

    let artist_container_element: HTMLDivElement | undefined = $state();
    let artist_ctx: p5 | undefined = $state();

    let observing = $state(false);
    const resize_observer = new ResizeObserver(() => artist_ctx?.windowResized?.());

    $effect(() => {
        if (artist_container_element && !observing) {
            resize_observer.observe(artist_container_element);
            observing = true;
        }
    });
</script>

<div class="home-artist-container" bind:this={artist_container_element}>
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
