/* WTF is this shit??
 *
 * Oftentimes variables are very complex to initialize. That is to say, computing a single result
 * takes many steps. It's not possible or practical to write all these steps on one line, so
 * we split them out into intermediate variables:
 * 
 * const number = 2;
 * const squared = number * number;
 * const with_one_added = squared + 1;
 * const final_number = with_one_added / 5;
 * 
 * This has its advantages and disadvantages. The big advantage is that it's extremely easy to 
 * debug. You just slap F10 a few times and watch for when the state becomes bad. It's also 
 * very, very simple. 
 * 
 * The disadvantage, though, is that's error-prone, because it leaves a bunch of intermediate
 * variables lying around all over the place that have some half of the computation. Using these
 * by accident would be really bad, and otherwise they just clog up autocomplete.
 * 
 * Another disadvantage is that it's incredibly ugly. We have a bunch of variables with really
 * obscure and random names cluttering up the code and disguising the actual important part,
 * the computation. This is a problem because it makes reading the code hard and confusing. 
 * 
 * Can we solve these disadvantages without sacrificing our advantages? Not really, but I tried.
 * That is what this pipeline pattern aims to do. Here's how it works:
 * 
 * const number = pipeline.of(2)
 *    .then(n => n * n)
 *    .then(n => n + 1)
 *    .then(n => n / 5)
 *    .done();
 *
 * It's obviously a lot like a map-filter-reduce pipeline, but you can use it on any ordinary value.
 * It's also obviously a lot like a Promise, but it has nothing to do with async code.
 * Now there are no random intermediate variables lying around, and our final variable is fully
 * initialized as soon as it exists, never half-initialized or uninitialized.
 * 
 * But wait, don't we lose debuggability? Sort of, but the most important functionality, the ability
 * to slap F10 and watch the state go from good to bad, is actually still there, because there is a
 * window into the most recent pipeline result through a private static variable. 
 * I will admit though, we lose simplicity. While this isn't rocket science, it's less obvious than a 
 * bunch of const x = y.
 * 
 * Time will tell if I am happy with this solution, but again, I tried.
 */

class PipelineStep<In> {
    // This exclusively exists for debugging purposes, so the last result
    // computed in the pipeline is visible from the debugger
    private static last_result: unknown;

    constructor (
        private execute: () => In,
    ) {}

    then<Out>(fn: (input: In) => Out): PipelineStep<Out> {
        const result = this.execute();
        PipelineStep.last_result = result;

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