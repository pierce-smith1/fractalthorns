export abstract class Store<T> {
    constructor (
        private items: Array<T> = [],
    ) {
        this.load().then(items => this.items = items);
    }

    get() {
        return [...this.items];
    }

    abstract load(): Promise<Array<T>>;
}