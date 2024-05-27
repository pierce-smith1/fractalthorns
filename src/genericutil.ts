export function unique<T>(array: Array<T>): Array<T> {
    return array.reduce((acc, item) => acc.includes(item) ? acc : (acc.push(item), acc), [] as Array<T>);
}

export function unique_by<T>(array: Array<T>, compare_fn: (a: T, b: T) => boolean): Array<T> {
    return array.reduce((acc, item) => acc.find(i => compare_fn(i, item)) ? acc : (acc.push(item), acc), [] as Array<T>);
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
