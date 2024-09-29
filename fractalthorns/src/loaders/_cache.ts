class MemoryCache {
    constructor(
        private items: {[key: string]: unknown}
    ) {}

    store(key: string, item: unknown) {
        this.items[key] = item;
    }

    get(key: string): unknown {
        return this.items[key];
    }

    async cache_results<T>(producer: () => Promise<T>, key_producer: () => string): Promise<T> {
        const key = key_producer();
        if (key in this.items) {
            return this.get(key) as T;
        }

        const item = await producer();
        this.store(key, item);
        return item;
    }
}

export const global = new MemoryCache({});