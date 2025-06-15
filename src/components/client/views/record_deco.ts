import p5 from "p5";

import * as Api from "../../../api/api";
import * as Episodic from "../../../helpers/record";

import {Artist} from "../../canvas/artist";

export const size = 64;

export type Style = {
    type: Episodic.Iteration
        | "265404-repentance"
        | "209151-somehow-i-knew"
    accent_color: string,
};

export function get_style(record: Api.RedactableRecordEntry): Style {
    if (record.name === "repentance") {
        return {
            type: "265404-repentance",
            accent_color: "#2c2d32",
        };
    }

    if (record.name === "somehow-i-knew") {
        return {
            type: "209151-somehow-i-knew",
            accent_color: "#fc4d93",
        };
    }

    return {
        type: record.iteration as Episodic.Iteration,
        accent_color: Episodic.get_iteration_color(record.iteration),
    };
}

// ---

function rads(degrees: number): number {
    return degrees * Math.PI / 180;
}

function apothem(sides: number): number {
    const a = 1 / (2 * Math.tan(Math.PI / sides));
    return a;
}

function circumradius(sides: number): number {
    const R = 1 / (2 * Math.sin(Math.PI / sides));
    return R;
}

type Point = {
    x: number,
    y: number,
};

function polar_translate(point: Point, radius: number, theta: number) {
    point.x += radius * Math.cos(theta);
    point.y += radius * Math.sin(theta);

    return point;
}

type AxialPoint = {
    q: number, 
    r: number
};

function axial_to_cartesian(axial: AxialPoint, radius: number, q_angle: number, r_angle: number): Point {
    const point = {x: 0, y: 0};

    polar_translate(point, radius * axial.q, q_angle);
    polar_translate(point, radius * axial.r, r_angle);

    return point;
}

const tile_shapes = [
    "floret",
    "hexagon",
    "eq_triangle",
    "square",
    "rhombus",
    "octagon",
] as const;
type TileShape = typeof tile_shapes[number];

function get_shape_verts(shape: TileShape): Array<Point> {
    if (shape === "floret") {
        const r_short = circumradius(3);
        const r_long = circumradius(6);

        const verts = [
            polar_translate({x: 0, y: 0}, r_short, rads(0)),
            polar_translate({x: 0, y: 0}, r_long, rads(90)),
            polar_translate({x: 0, y: 0}, r_short, rads(180)),
            polar_translate({x: 0, y: 0}, r_short, rads(240)),
            polar_translate({x: 0, y: 0}, r_short, rads(300)),
        ];

        return verts;
    }

    if (shape === "hexagon") {
        const r = circumradius(6);

        const verts = [
            polar_translate({x: 0, y: 0}, r, rads(0)),
            polar_translate({x: 0, y: 0}, r, rads(60)),
            polar_translate({x: 0, y: 0}, r, rads(120)),
            polar_translate({x: 0, y: 0}, r, rads(180)),
            polar_translate({x: 0, y: 0}, r, rads(240)),
            polar_translate({x: 0, y: 0}, r, rads(300)),
        ];

        return verts;
    }

    if (shape === "eq_triangle") {
        const r = circumradius(3);

        const verts = [
            polar_translate({x: 0, y: 0}, r, rads(0)),
            polar_translate({x: 0, y: 0}, r, rads(120)),
            polar_translate({x: 0, y: 0}, r, rads(240)),
        ];

        return verts;
    }

    if (shape === "square") {
        const r = circumradius(4);

        const verts = [
            polar_translate({x: 0, y: 0}, r, rads(0)),
            polar_translate({x: 0, y: 0}, r, rads(90)),
            polar_translate({x: 0, y: 0}, r, rads(180)),
            polar_translate({x: 0, y: 0}, r, rads(270)),
        ];

        return verts;
    }

    if (shape === "rhombus") {
        const r_short = 1/2;
        const r_long = Math.sqrt(3) / 2;

        const verts = [
            polar_translate({x: 0, y: 0}, r_short, rads(0)),
            polar_translate({x: 0, y: 0}, r_long, rads(90)),
            polar_translate({x: 0, y: 0}, r_short, rads(180)),
            polar_translate({x: 0, y: 0}, r_long, rads(270)),
        ];

        return verts;
    }

    if (shape === "octagon") {
        const r = circumradius(8);

        const verts = [
            polar_translate({x: 0, y: 0}, r, rads(0)),
            polar_translate({x: 0, y: 0}, r, rads(45)),
            polar_translate({x: 0, y: 0}, r, rads(90)),
            polar_translate({x: 0, y: 0}, r, rads(135)),
            polar_translate({x: 0, y: 0}, r, rads(180)),
            polar_translate({x: 0, y: 0}, r, rads(225)),
            polar_translate({x: 0, y: 0}, r, rads(270)),
            polar_translate({x: 0, y: 0}, r, rads(315)),
        ];

        return verts;
    }

    throw new Error(`Unknown shape ${shape}`);
}

function get_vert_midpoints(verts: Array<Point>): Array<Point> {
    const midpoints = [];

    for (let i = 0; i < verts.length; i++) {
        const a = verts[i];
        const b = verts[(i + 1) % verts.length];

        const x = a.x + (b.x - a.x) / 2;
        const y = a.y + (b.y - a.y) / 2;

        midpoints.push({x, y});
    }

    return midpoints;
}

type Tile = {
    center: Point,
    angle: number,
    shape: TileShape,
};

type Bounds = {
    top: number,
    left: number,
    bottom: number,
    right: number,
};

function is_in_bounds(point: Point, bounds: Bounds): boolean {
    const x_in_bounds = point.x >= bounds.left && point.x <= bounds.right;
    const y_in_bounds = point.y >= bounds.top && point.y <= bounds.bottom;

    return x_in_bounds && y_in_bounds;
}

type Tiling = {
    tile_group_provider: (center: Point) => Array<Tile>,
    tile_group_extent: number,
    axial_radius: number,
    axial_angle: number,
};

function place_tiling(tiling: Tiling, bounds: Bounds, symmetry: "square" | "hexagonal"): Array<Tile> {
    const tiles: Array<Tile> = [];

    const placed_axials: Array<AxialPoint> = [];
    const frontier_axials: Array<AxialPoint> = [
        {q: 0, r: 0},
    ];

    const buffered_bounds = {
        left: bounds.left - tiling.tile_group_extent,
        top: bounds.top - tiling.tile_group_extent,
        right: bounds.right + tiling.tile_group_extent,
        bottom: bounds.bottom + tiling.tile_group_extent,
    };

    while (frontier_axials.length > 0) {
        const axial = frontier_axials.shift()!;

        if (placed_axials.find(placed_axial => placed_axial.q === axial.q && placed_axial.r === axial.r)) {
            continue;
        }

        const group_center = axial_to_cartesian(
            axial, 
            tiling.axial_radius, 
            tiling.axial_angle, 
            symmetry === "hexagonal" ? tiling.axial_angle + rads(120) : tiling.axial_angle + rads(90)
        );

        if (!is_in_bounds(group_center, buffered_bounds)) {
            continue;
        }

        tiles.push(...tiling.tile_group_provider(group_center));

        placed_axials.push(axial);
        frontier_axials.push(...
            symmetry === "hexagonal"
            ? [
                {q: axial.q + 1, r: axial.r},
                {q: axial.q, r: axial.r + 1},
                {q: axial.q + 1, r: axial.r + 1},
                {q: axial.q - 1, r: axial.r - 1},
                {q: axial.q - 1, r: axial.r},
                {q: axial.q, r: axial.r - 1},
            ] : [
                {q: axial.q + 1, r: axial.r},
                {q: axial.q, r: axial.r + 1},
                {q: axial.q - 1, r: axial.r},
                {q: axial.q, r: axial.r - 1},
            ]
        );
    }

    return tiles;
}

function place_floret_tiling(bounds: Bounds, random_skew: number): Array<Tile> {
    const r_long = circumradius(6);
    const axial_radius = Math.sqrt(5 - 4 * Math.cos(rads(120)));

    function tile_group_at_center(center: Point) {
        const tile_group: Array<Tile> = [
            {center: polar_translate({...center}, r_long, rads(0) + random_skew), angle: rads(0 + 90) + random_skew, shape: "floret"},
            {center: polar_translate({...center}, r_long, rads(60) + random_skew), angle: rads(60 + 90) + random_skew, shape: "floret"},
            {center: polar_translate({...center}, r_long, rads(120) + random_skew), angle: rads(120 + 90) + random_skew, shape: "floret"},
            {center: polar_translate({...center}, r_long, rads(180) + random_skew), angle: rads(180 + 90) + random_skew, shape: "floret"},
            {center: polar_translate({...center}, r_long, rads(240) + random_skew), angle: rads(240 + 90) + random_skew, shape: "floret"},
            {center: polar_translate({...center}, r_long, rads(300) + random_skew), angle: rads(300 + 90) + random_skew, shape: "floret"},
        ];

        return tile_group;
    };

    const tiles = place_tiling({
        tile_group_provider: tile_group_at_center,
        tile_group_extent: r_long,
        axial_radius,
        axial_angle: Math.acos((axial_radius * axial_radius + 4 - 1) / (4 * axial_radius)) + random_skew,
    }, bounds, "hexagonal");

    return tiles;
}

function place_rhombitrihexagonal_tiling(bounds: Bounds, random_skew: number): Array<Tile> {
    const tile_group_extent = 2 * Math.sqrt(3) + 1;
    const axial_radius = 2 * apothem(6) + 1;
    const axial_angle = rads(30) + random_skew;

    function tile_group_at_center(center: Point): Array<Tile> {
        const tile_group: Array<Tile> = [
            {center, angle: rads(0) + random_skew, shape: "hexagon"},
            {
                center: polar_translate({...center}, apothem(6) + apothem(4), rads(30) + random_skew), 
                angle: rads(30 + 45) + random_skew, 
                shape: "square",
            }, {
                center: polar_translate({...center}, apothem(6) + apothem(4), -rads(30) + random_skew), 
                angle: rads(-30 + 45) + random_skew, 
                shape: "square",
            }, {
                center: polar_translate({...center}, circumradius(6) + circumradius(3), rads(0) + random_skew), 
                angle: rads(180) + random_skew, 
                shape: "eq_triangle",
            }, {
                center: polar_translate({...center}, circumradius(6) + circumradius(3) + apothem(3) + 1/2, rads(0) + random_skew), 
                angle: rads(45) + random_skew, 
                shape: "square",
            }, {
                center: polar_translate({...center}, circumradius(6) + circumradius(3) + apothem(3) + 1 + apothem(3), rads(0) + random_skew), 
                angle: rads(0) + random_skew,
                shape: "eq_triangle",
            },
        ];

        return tile_group;
    }

    const tiles = place_tiling({
        tile_group_provider: tile_group_at_center,
        tile_group_extent,
        axial_angle,
        axial_radius,
    }, bounds, "hexagonal");

    return tiles;
}

function place_rhombille_tiling(bounds: Bounds, random_skew: number): Array<Tile> {
    const tile_group_extent = 2;
    const axial_radius = 2 * Math.sqrt(3);
    const axial_angle = rads(30) + random_skew;

    function tile_group_at_center(center: Point): Array<Tile> {
        const tile_group: Array<Tile> = [
            {center: polar_translate({...center}, Math.sqrt(3) / 2, rads(30) + random_skew), angle: rads(30 + 90) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, Math.sqrt(3) / 2, rads(90) + random_skew), angle: rads(90 + 90) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, Math.sqrt(3) / 2, rads(150) + random_skew), angle: rads(150 + 90) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, Math.sqrt(3) / 2, rads(210) + random_skew), angle: rads(210 + 90) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, Math.sqrt(3) / 2, rads(270) + random_skew), angle: rads(270 + 90) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, Math.sqrt(3) / 2, rads(330) + random_skew), angle: rads(330 + 90) + random_skew, shape: "rhombus"},

            {center: polar_translate({...center}, 3/2, rads(0) + random_skew), angle: rads(0) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, 3/2, rads(60) + random_skew), angle: rads(60) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, 3/2, rads(120) + random_skew), angle: rads(120) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, 3/2, rads(180) + random_skew), angle: rads(180) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, 3/2, rads(240) + random_skew), angle: rads(240) + random_skew, shape: "rhombus"},
            {center: polar_translate({...center}, 3/2, rads(300) + random_skew), angle: rads(300) + random_skew, shape: "rhombus"},
        ];

        return tile_group;
    }

    const tiles = place_tiling({
        tile_group_provider: tile_group_at_center,
        tile_group_extent,
        axial_angle,
        axial_radius,
    }, bounds, "hexagonal");

    return tiles;
}

function place_hex_tiling(bounds: Bounds, random_skew: number): Array<Tile> {
    const tile_group_extent = circumradius(6);
    const axial_radius = 2 * apothem(6);
    const axial_angle = rads(30) + random_skew;

    function tile_group_at_center(center: Point): Array<Tile> {
        return [{center: {...center}, angle: rads(0) + random_skew, shape: "hexagon"}];
    }

    const tiles = place_tiling({
        tile_group_provider: tile_group_at_center,
        tile_group_extent,
        axial_angle,
        axial_radius,
    }, bounds, "hexagonal");

    return tiles;
}

function place_truncated_square_tiling(bounds: Bounds, random_skew: number): Array<Tile> {
    const tile_group_extent = 2 * (apothem(8) + apothem(4));
    const axial_radius = 2 * apothem(8);
    const axial_angle = random_skew;

    function tile_group_at_center(center: Point): Array<Tile> {
        const tile_group: Array<Tile> = [
            {center: {...center}, angle: rads(45 / 2) + random_skew, shape: "octagon"},
            {center: polar_translate({...center}, apothem(8) + apothem(4), rads(45) + random_skew), angle: random_skew, shape: "square"},
        ];

        return tile_group;
    }

    const tiles = place_tiling({
        tile_group_provider: tile_group_at_center,
        tile_group_extent,
        axial_angle,
        axial_radius,
    }, bounds, "square");

    return tiles;
}

export class GutterDecoArtist extends Artist {
    scale: number;
    shape_verts: {[shape in TileShape]: Array<Point>};
    shape_control_points: {[shape in TileShape]: Array<Point>};
    rng_offset: number;

    constructor (
        public readonly style: Style | null,
    ) {
        super();

        this.scale = 25;

        this.shape_verts = Object.fromEntries(tile_shapes.map(shape => [shape, get_shape_verts(shape)])) as {[shape in TileShape]: Array<Point>};

        this.shape_control_points = Object.fromEntries(Object.entries(this.shape_verts)
            .map(([shape, verts]) => [shape, get_vert_midpoints(verts)])) as {[shape in TileShape]: Array<Point>};

        this.rng_offset = Math.random();
    }

    width() {
        return size;
    }

    height() {
        return window.innerHeight;
    }

    preload() { }

    setup(ctx: p5, canvas: HTMLCanvasElement) {
        super.setup(ctx, canvas);

        ctx.windowResized = () => {
            ctx.resizeCanvas(this.width(), this.height());
        };

        ctx.frameRate(30);
    }

    draw(ctx: p5) {
        if (!this.style) {
            return;
        }

        ctx.randomSeed(this.rng_offset * 227000);

        ctx.scale(this.scale);

        ctx.clear();

        this.draw_background(ctx);

        const skew = ctx.random();
        const bounds = this.get_bounds(ctx);
        const tiles = (() => {
            if (this.style.type.startsWith("265404")) {
                return place_floret_tiling(bounds, skew);
            }

            if (this.style.type.startsWith("768221")) {
                return place_rhombitrihexagonal_tiling(bounds, skew);
            }

            if (this.style.type.startsWith("209151")) {
                return place_rhombille_tiling(bounds, skew);
            }

            if (this.style.type.startsWith("0")) {
                return place_hex_tiling(bounds, skew);
            }

            if (this.style.type.startsWith("768220")) {
                return place_truncated_square_tiling(bounds, skew);
            }

            return [];
        })();

        this.draw_tiles(tiles, ctx);
    }

    draw_background(ctx: p5) {
        if (this.style!.type.startsWith("0")) {
            ctx.background(0);
            return;
        }

        ctx.push();

        const background_color = ctx.color(this.style!.accent_color)
        background_color.setAlpha(150 + Math.sin(ctx.frameCount / 250) * 50);

        ctx.background(background_color);

        ctx.pop();
    }

    draw_tiles(tiles: Array<Tile>, ctx: p5) {
        ctx.push();
        
        ctx.noFill();
        ctx.stroke(ctx.lerpColor(ctx.color(this.style!.accent_color), ctx.color(255), 0.5));
        if (this.style!.type.startsWith("0")) {
            ctx.stroke(ctx.lerpColor(ctx.color(this.style!.accent_color), ctx.color(0), 0.8));
        }

        for (const tile of tiles) {
            if (!this.style!.type.startsWith("0")) {
                this.draw_tile_truchet(tile, ctx);
            }

            ctx.push();

            ctx.translate(tile.center.x, tile.center.y);
            ctx.rotate(tile.angle);

            ctx.strokeWeight(1 / this.scale);

            ctx.beginShape();
            for (const vertex of this.shape_verts[tile.shape]) {
                ctx.vertex(vertex.x, vertex.y);
            }
            ctx.endShape(ctx.CLOSE);

            ctx.pop();

            if (this.style!.type.startsWith("0")) {
                this.draw_tile_truchet(tile, ctx);
            }
        }

        ctx.pop();
    }

    draw_tile_truchet(tile: Tile, ctx: p5) {
        const control_points = this.shape_control_points[tile.shape];
        const root_control_point = control_points[Math.floor(ctx.random() * control_points.length)];

        function t(slow_factor: number, offset?: number): number {
            return Math.pow(Math.sin((ctx.frameCount + ((offset ?? 0) * 5000)) / (200 * slow_factor)), 2);
        }

        ctx.push();

        ctx.translate(tile.center.x, tile.center.y);
        ctx.rotate(tile.angle);

        ctx.noFill();
        ctx.stroke(ctx.lerpColor(ctx.color(this.style!.accent_color), ctx.color("black"), 0.5));
        ctx.strokeWeight(2 / this.scale);

        const draw_fruity_truchet = () => {
            for (const control_point of control_points) {
                if (control_point === root_control_point) {
                    continue;
                }

                const a = root_control_point;
                const b = control_point;

                ctx.bezier(
                    a.x, a.y, 
                    ctx.lerp(0, a.x, ctx.lerp(0.3, 0.7, t(2))), ctx.lerp(0, a.x, ctx.lerp(0.3, 0.7, t(3))),
                    ctx.lerp(0, b.x, ctx.lerp(0.3, 0.7, t(4))), ctx.lerp(0, b.x, ctx.lerp(0.3, 0.7, t(5))),
                    b.x, b.y
                );
            }
        };

        const draw_rhombic_truchet = () => {
            const random_grow = ctx.random();
            for (const control_point of control_points) {
                ctx.line(ctx.lerp(control_point.x, 0, t(8, random_grow)), ctx.lerp(control_point.y, 0, t(8, random_grow)), 0, 0);
            }
        };

        const draw_bright_truchet = () => {
            ctx.stroke(ctx.lerpColor(ctx.color(this.style!.accent_color), ctx.color("white"), 0.5));
            ctx.strokeWeight((5 * t(1, ctx.random())) / this.scale);

            ctx.point(0, 0);

            if (ctx.random() < 0.2) {
                ctx.strokeWeight(2 / this.scale);
                ctx.line(root_control_point.x, root_control_point.y, 0, 0);
            }
        };

        const draw_thick_truchet = () => {
            ctx.stroke(ctx.color("#ea0042"));
            ctx.strokeWeight(3 / this.scale);

            const connected_control_points = control_points.filter(() => ctx.random() < 0.5);

            connected_control_points.forEach((control_point, i) => {
                if (i === connected_control_points.length - 1) {
                    return;
                }

                const next_control_point = connected_control_points[(i + 1) % connected_control_points.length];

                const a = control_point;
                const b = next_control_point;

                ctx.bezier(
                    a.x, a.y, 
                    0, 0,
                    0, 0,
                    b.x, b.y
                );
            });

            for (const control_point of control_points) {
                ctx.point(control_point.x, control_point.y);
            }
        };

        const draw_cracked_truchet = () => {
            const unpaired_points = [...control_points];
            const pairs = [];

            if (unpaired_points.length % 2) {
                unpaired_points.splice(Math.floor(ctx.random() * unpaired_points.length), 1);
            }

            while (unpaired_points.length > 2) {
                const index_1 = Math.floor(ctx.random() * unpaired_points.length);

                let offset = 2 * (Math.floor(ctx.random() * unpaired_points.length / 2));
                if (offset === 0) {
                    offset = 2;
                }

                const index_2 = (index_1 + offset) % unpaired_points.length;

                const high_index = Math.max(index_1, index_2);
                const low_index = Math.min(index_1, index_2);

                const [point_1] = unpaired_points.splice(high_index, 1);
                const [point_2] = unpaired_points.splice(low_index, 1);

                pairs.push([point_1, point_2]);
            }

            pairs.push([unpaired_points[0], unpaired_points[1]]);

            for (const [a, b] of pairs) {
                ctx.line(a.x, a.y, b.x, b.y);
            }
        };

        const all_truchets_painters = [
            draw_fruity_truchet,
            draw_rhombic_truchet,
            draw_bright_truchet,
            draw_thick_truchet,
            draw_cracked_truchet,
        ];

        if (this.style!.type.startsWith("265404")) {
            draw_fruity_truchet();
        } else if (this.style!.type.startsWith("768221")) {
            draw_rhombic_truchet();
        } else if (this.style!.type.startsWith("209151")) {
            draw_bright_truchet();
        } else if (this.style!.type.startsWith("0")) {
            all_truchets_painters[Math.floor(ctx.random() * all_truchets_painters.length)]();
        } else if (this.style!.type.startsWith("768220")) {
            draw_cracked_truchet();
        }

        ctx.pop();
    }

    get_bounds(ctx: p5): Bounds {
        const top = 0;
        const left = 0;
        const right = ctx.width / this.scale;
        const bottom = ctx.height / this.scale;

        return {top, left, right, bottom};
    }
}