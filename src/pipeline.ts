class PipelineStep<In> {
    constructor (
        private execute: () => In,
    ) {}

    then<Out>(fn: (input: In) => Out): PipelineStep<Out> {
        const result = this.execute();
        return new PipelineStep<Out>(() => fn(result));
    }

    done(): In {
        return this.execute();
    }
}

export const pipeline = {
    start<T>(value: T) {
        return new PipelineStep<T>(() => value);
    }
};