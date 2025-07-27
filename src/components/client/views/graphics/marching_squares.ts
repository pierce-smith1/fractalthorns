import p5 from "p5"

export type ImplicitFunction = (x: number, y: number) => number;

type RealCoord = {
    x: number,
    y: number,
}

type SquareCoord = {
    xs: number,
    ys: number,
}

const square_size = 16;

function memoize(fn: ImplicitFunction): ImplicitFunction {
    const memo: {[x: number]: {[y: number]: number}} = {};
    return (x, y) => {
        memo[x] ??= {};

        if (memo[x][y]) {
            return memo[x][y];
        }

        const v = fn(x, y);
        memo[x][y] = v;

        return v;
    };
}

function square_to_real(square: SquareCoord): [number, number] {
    return [square.xs * square_size, square.ys * square_size];
}

export function draw_implicit(fn: ImplicitFunction, threshold: number, ctx: p5) {
    fn = memoize(fn);

    for_all_cells((real, square) => {
        const {
            top_left: tl,
            top_right: tr,
            bot_left: bl,
            bot_right: br,
        } = get_corners(square);

        const top_left_above = fn(...square_to_real(tl)) > threshold;
        const top_right_above = fn(...square_to_real(tr)) > threshold;
        const bot_right_above = fn(...square_to_real(br)) > threshold;
        const bot_left_above = fn(...square_to_real(bl)) > threshold;

        const pattern =
            (top_left_above ? 8 : 0) +
            (top_right_above ? 4 : 0) +
            (bot_right_above ? 2 : 0) +
            (bot_left_above ? 1 : 0);

        const point_groups: Array<Array<SquareCoord>> = pattern === 0 ? [[
                tl, tr, br, bl
            ]] : pattern === 1 ? [[
                tl, tr, bl,
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(bl, tl, "y"),
            ]] : pattern === 2 ? [[
                bl, tl, tr,
                get_isoline_point_between(tr, br, "y"),
                get_isoline_point_between(br, bl, "x"),
            ]] : pattern === 3 ? [[
                tl, tr,
                get_isoline_point_between(tr, br, "y"),
                get_isoline_point_between(tl, bl, "y"),
            ]] : pattern === 4 ? [[
                tl, bl, br,
                get_isoline_point_between(br, tr, "y"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 5 ? [
                [
                    tl,
                    get_isoline_point_between(tl, tr, "x"),
                    get_isoline_point_between(tl, bl, "y"),
                ], [
                    br,
                    get_isoline_point_between(bl, br, "x"),
                    get_isoline_point_between(tr, br, "y"),
                ]
            ] : pattern === 6 ? [[
                tl, bl,
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 7 ? [[
                tl,
                get_isoline_point_between(tl, tr, "x"),
                get_isoline_point_between(tl, bl, "y"),
            ]] : pattern === 8 ? [[
                tr, br, bl,
                get_isoline_point_between(tl, bl, "y"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 9 ? [[
                tr, br,
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 10 ? [
                [
                    tr,
                    get_isoline_point_between(tr, br, "y"),
                    get_isoline_point_between(tl, tr, "x"),
                ],
                [
                    bl,
                    get_isoline_point_between(br, bl, "x"),
                    get_isoline_point_between(tl, bl, "y"),
                ]
            ] : pattern === 11 ? [[
                tr,
                get_isoline_point_between(br, tr, "y"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 12 ? [[
                bl, br,
                get_isoline_point_between(tr, br, "y"),
                get_isoline_point_between(tl, bl, "y"),
            ]] : pattern === 13 ? [[
                br,
                get_isoline_point_between(br, bl, "x"),
                get_isoline_point_between(tr, br, "y"),
            ]] : pattern === 14 ? [[
                bl,
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(bl, tl, "y"),
            ]] : [];

        for (const points of point_groups) {
            draw_shape(points, ctx);
        }

        function get_isoline_point_between(a: SquareCoord, b: SquareCoord, orientation: "x" | "y"): SquareCoord {
            const dimension: keyof SquareCoord = orientation === "x" ? "xs" : "ys";
            const fixed_dimension: keyof SquareCoord = dimension === "xs" ? "ys" : "xs";

            const point_var = ctx.map(
                threshold,
                fn(...square_to_real(a)), fn(...square_to_real(b)),
                a[dimension], b[dimension]
            );

            const point = {
                [dimension]: point_var,
                [fixed_dimension]: a[fixed_dimension],
            } as SquareCoord;

            return point;
        }
    }, ctx);
}

function reverse_lerp(start: number, end: number, value: number): number {
    const t = (value - start) / (end - start);
    return t;
}

function draw_shape(points: Array<SquareCoord>, ctx: p5) {
    ctx.beginShape();

    for (const point of points) {
        ctx.vertex(...square_to_real(point));
    }

    ctx.endShape();
}

function for_all_cells(fn: (real: RealCoord, square: SquareCoord) => void, ctx: p5) {
    for (let y = 0; y < ctx.height + square_size; y += square_size) {
        for (let x = 0; x < ctx.width + square_size; x += square_size) {
            const ys = y / square_size;
            const xs = x / square_size;

            fn({x, y}, {xs, ys});
        }
    }
}

function get_corners(top_left: SquareCoord) {
    const top_right = {xs: top_left.xs + 1, ys: top_left.ys    };
    const bot_left  = {xs: top_left.xs    , ys: top_left.ys + 1};
    const bot_right = {xs: top_left.xs + 1, ys: top_left.ys + 1};

    return {top_left, top_right, bot_left, bot_right};
}

