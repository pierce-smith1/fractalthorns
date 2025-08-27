export function unique<T>(array: Array<T>): Array<T> {
    return array.reduce((acc, item) => acc.includes(item) ? acc : (acc.push(item), acc), [] as Array<T>);
}

export function unique_by<T>(array: Array<T>, compare_fn: (a: T, b: T) => boolean): Array<T> {
    return array.reduce((acc, item) => acc.find(i => compare_fn(i, item)) ? acc : (acc.push(item), acc), [] as Array<T>);
}

export function unique_by_key<T>(array: Array<T>, key_fn: (t: T) => unknown): Array<T> {
    return array.reduce((acc, item) => acc.find(i => key_fn(i) == key_fn(item)) ? acc : (acc.push(item), acc), [] as Array<T>);
}

export function sample<T>(array: Array<T>): T | undefined {
    if (array.length === 0) {
        return undefined;
    }

    const sample = array[Math.floor(Math.random() * array.length)];
    return sample;
}

export function neighbors<T>(index: number, array: Array<T>) {
    const lower = index - 1 < 0 ? 0 : index - 1;
    const higher = index + 1 >= array.length ? array.length - 1 : index + 1;

    return [array[lower], array[higher]];
}

export function undefined_if_empty<T>(array: Array<T>): Array<T> | undefined {
    return array.length === 0 ? undefined : array;
}

export function non_null<T>(array: Array<T>): Array<Exclude<T, null | undefined>> {
    return array.filter(x => x) as Array<Exclude<T, null | undefined>>;
}

export function undefined_if_all_null<T>(array: Array<T>): Array<Exclude<T, null | undefined>> | undefined {
    return undefined_if_empty(non_null(array));
}

export function parse_color_string(color: string): {r: number, g: number, b: number} | undefined {
    if (color.startsWith("#")) {
        color = color.substring(1);
    }

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return undefined;
    }

    return {r, g, b};
}

export function lightness_of_color(color_string: string): "dark" | "light" | undefined {
    const color = parse_color_string(color_string);
    if (!color) {
        return undefined;
    }

    return (color.r + color.g + color.b > (128 * 3))
        ? "light"
        : "dark";
}
