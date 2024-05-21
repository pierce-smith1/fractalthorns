export function load_once_keep_forever<R extends {[key: string]: any}, Fn extends () => Promise<R>>(fn: Fn, key: string): () => Promise<R> {
    const cache: {[key: string]: any} = {};
    return async () => {
        if (!(key in cache)) {
            cache[key] = await fn();
        }

        return cache[key];
    }
}