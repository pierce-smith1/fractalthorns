import p5 from "p5"

export type ImplicitFunction = (x: number, y: number) => number;

type RealCoord = {
    x: number,
    y: number,
}

type QuadLeaf = {
    x: number,
    y: number,
    size: number,
};

export function draw_implicit(fn: ImplicitFunction, threshold: number, ctx: p5) {
    ctx.push();

    const center = {x: ctx.width / 2, y: ctx.height / 2};
    ctx.translate(center.x, center.y);

    const quadleaves = get_all_quadleaves(fn, threshold, ctx);

    for (const leaf of quadleaves) {
        ctx.point(leaf.x, leaf.y);

        const {
            top_left: tl,
            top_right: tr,
            bot_left: bl,
            bot_right: br,
        } = get_corners(leaf);

        const top_left_above = fn(tl.x, tl.y) > threshold;
        const top_right_above = fn(tr.x, tr.y) > threshold;
        const bot_right_above = fn(br.x, br.y) > threshold;
        const bot_left_above = fn(bl.x, bl.y) > threshold;

        const pattern =
            (top_left_above ? 8 : 0) +
            (top_right_above ? 4 : 0) +
            (bot_right_above ? 2 : 0) +
            (bot_left_above ? 1 : 0);

        const point_groups: Array<[RealCoord, RealCoord]> =
            pattern === 1 ? [[
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(bl, tl, "y"),
            ]] : pattern === 2 ? [[
                get_isoline_point_between(tr, br, "y"),
                get_isoline_point_between(br, bl, "x"),
            ]] : pattern === 3 ? [[
                get_isoline_point_between(tr, br, "y"),
                get_isoline_point_between(tl, bl, "y"),
            ]] : pattern === 4 ? [[
                get_isoline_point_between(br, tr, "y"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 5 ? [
                [
                    get_isoline_point_between(tl, tr, "x"),
                    get_isoline_point_between(tl, bl, "y"),
                ], [
                    get_isoline_point_between(bl, br, "x"),
                    get_isoline_point_between(tr, br, "y"),
                ]
            ] : pattern === 6 ? [[
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 7 ? [[
                get_isoline_point_between(tl, tr, "x"),
                get_isoline_point_between(tl, bl, "y"),
            ]] : pattern === 8 ? [[
                get_isoline_point_between(tl, bl, "y"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 9 ? [[
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 10 ? [
                [
                    get_isoline_point_between(tr, br, "y"),
                    get_isoline_point_between(tl, tr, "x"),
                ],
                [
                    get_isoline_point_between(br, bl, "x"),
                    get_isoline_point_between(tl, bl, "y"),
                ]
            ] : pattern === 11 ? [[
                get_isoline_point_between(br, tr, "y"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 12 ? [[
                get_isoline_point_between(tr, br, "y"),
                get_isoline_point_between(tl, bl, "y"),
            ]] : pattern === 13 ? [[
                get_isoline_point_between(br, bl, "x"),
                get_isoline_point_between(tr, br, "y"),
            ]] : pattern === 14 ? [[
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(bl, tl, "y"),
            ]] : [];

        for (const [a, b] of point_groups) {
            ctx.line(a.x, a.y, b.x, b.y);
        }

        function get_isoline_point_between(a: RealCoord, b: RealCoord, orientation: "x" | "y"): RealCoord {
            const dimension = orientation;
            const fixed_dimension = dimension === "x" ? "y" : "x";

            const point_var = ctx.map(
                threshold,
                fn(a.x, a.y), fn(b.x, b.y),
                a[dimension], b[dimension]
            );

            const point = {
                [dimension]: point_var,
                [fixed_dimension]: a[fixed_dimension],
            } as RealCoord;

            return point;
        }
    }

    ctx.pop();
}

function get_all_quadleaves(fn: ImplicitFunction, threshold: number, ctx: p5): Array<QuadLeaf> {
    const x_span = Math.ceil(ctx.width / 2);
    const y_span = Math.ceil(ctx.height / 2);

    const min_span = ctx.min(x_span, y_span);
    const min_size = ctx.min(ctx.width, ctx.height);

    function split(leaf: QuadLeaf): [QuadLeaf, QuadLeaf, QuadLeaf, QuadLeaf] {
        const split_size = leaf.size / 2;

        const top_left = {x: leaf.x, y: leaf.y, size: split_size};
        const top_right = {x: leaf.x + split_size, y: leaf.y, size: split_size};
        const bot_left = {x: leaf.x, y: leaf.y + split_size, size: split_size};
        const bot_right = {x: leaf.x + split_size, y: leaf.y + split_size, size: split_size};

        return [top_left, top_right, bot_left, bot_right];
    }

    const root: QuadLeaf = {
        x: -min_span,
        y: -min_span,
        size: min_size,
    };

    let leaves = [root];

    const initial_splits = 4;
    for (let i = 0; i < initial_splits; i++) {
        leaves = leaves.flatMap(split);
    }

    function is_leaf_interesting(leaf: QuadLeaf): boolean {
        const top_left_above = fn(leaf.x, leaf.y) > threshold;
        const top_right_above = fn(leaf.x + leaf.size, leaf.y) > threshold;
        const bot_left_above = fn(leaf.x, leaf.y + leaf.size) > threshold;
        const bot_right_above = fn(leaf.x + leaf.size, leaf.y + leaf.size) > threshold;
        const center_above = fn(leaf.x + leaf.size / 2, leaf.y + leaf.size / 2) > threshold;

        return !(
            top_left_above === top_right_above &&
            top_right_above === bot_left_above &&
            bot_left_above === bot_right_above &&
            bot_right_above === center_above
        );
    }

    const max_deep_splits = 4;
    leaves = leaves.flatMap(leaf => {
        function split_recurse(leaf: QuadLeaf, depth: number): Array<QuadLeaf> {
            if (depth >= max_deep_splits) {
                return [leaf];
            }

            if (is_leaf_interesting(leaf)) {
                return split(leaf).flatMap(child => split_recurse(child, depth + 1));
            }

            return [leaf];
        }

        return split_recurse(leaf, 1);
    })

    return leaves;
}

function get_corners(leaf: QuadLeaf): {
    top_left: RealCoord,
    top_right: RealCoord,
    bot_left: RealCoord,
    bot_right: RealCoord,
} {
    const top_left = {x: leaf.x, y: leaf.y};
    const top_right = {x: leaf.x + leaf.size, y: leaf.y};
    const bot_left  = {x: leaf.x, y: leaf.y + leaf.size};
    const bot_right = {x: leaf.x + leaf.size, y: leaf.y + leaf.size};

    return {top_left, top_right, bot_left, bot_right};
}

