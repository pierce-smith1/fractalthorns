export function unique<T>(array: Array<T>): Array<T> {
    return array.reduce((acc, item) => acc.includes(item) ? acc : (acc.push(item), acc), [] as Array<T>);
}

export function sample<T>(array: Array<T>): T | undefined {
    if (array.length === 0) {
        return undefined;
    }

    const sample = array[Math.floor(Math.random() * array.length)];
    return sample;
}
