import * as Kysely from "kysely"

export function coalesce_rows<R, O>({rows, get_key, merge}: {
    rows: Array<R>,
    get_key: (row: R) => string | number,
    merge: (representative: R, rows: Array<R>) => O,
}): Array<O> {
    const groups = Object.groupBy(rows, get_key) as Record<string, Array<R>>;

    const objects = Object.entries(groups).map(([_key, group]) => ({
        representative: group[0],
        object: merge(group[0], group),
    }))
        .toSorted((a, b) => original_ordering(a.representative, b.representative))
        .map(x => x.object);

    return objects;

    function original_ordering(a: R, b: R): number {
        return rows.findIndex(x => x === a) - rows.findIndex(x => x === b);
    }
}

export function coalesce_to_one<R, O>({rows, merge}: {
    rows: Array<R>,
    merge: (representative: R, rows: Array<R>) => O,
}): O {
    const object = merge(rows[0], rows);
    return object;
}

export type BaseQuery<Q extends Kysely.Compilable<any>, O> = {
    query: Q,
    merge_fn: (representative: Kysely.InferResult<Q>[number], rows: Kysely.InferResult<Q>) => O,
}

export function make_base_query<Q extends Kysely.Compilable<any>, O>(
    query: Q,
    merge_fn: (representative: Kysely.InferResult<Q>[number], rows: Kysely.InferResult<Q>) => O
): BaseQuery<Q, O> {
    return {query, merge_fn};
}
