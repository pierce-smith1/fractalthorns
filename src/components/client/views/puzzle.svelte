<script lang="ts">
    import p5 from "p5";
    import {onDestroy} from "svelte";

    import * as Fetchers from "../../../fetchers";
    import * as Puzzle from "../../../helpers/puzzle";
    import * as Record from "../../../helpers/record";

    import Loading from '../loading.svelte';
    import PageLink from "../page_link.svelte";

    export let name: string;

    let return_records: Array<string> | null = null;

    $: puzzle_promise = Fetchers.get.single_puzzle({name});
    $: if (puzzle_promise) {
        puzzle_promise.then(puzzle => {
            if (puzzle.solved) {
                return_records = puzzle.solved;
            }
        });
    }

    $: if (name) {
        return_records = null;
    }

    // BRITTLE: hardcoding paths because it's the only way
    // Vite needs to know how to bundle these things, the only way it
    // can do that is if we specify the path directly :(
    $: puzzle_modules = import.meta.glob("../../../../_content/puzzles/**/*.ts");
    $: [module_path, get_module_promise] = Object.entries(puzzle_modules)
        .find(([path, get_promise]) => path.includes(`${name}.ts`))!;

    let ctx: p5 | undefined;
    function refresh_ctx(sketch: (ctx: p5) => void) {
        ctx?.remove();
        ctx = new p5(sketch);
    }

    $: module_promise = get_module_promise() as Promise<Puzzle.PuzzleModule>;
    $: if (module_promise) {
        module_promise.then(module => {
            refresh_ctx(module.sketch);

            module.sketch.set_complete_handler((unlocked_records: Array<string>) => {
                return_records = unlocked_records;

                Fetchers.invalidate_cache("full_episodic");
                Fetchers.invalidate_cache("all_puzzles");
                Fetchers.invalidate_cache("single_puzzle");
            });
        });
    }

    onDestroy(() => {
        ctx?.remove();
    });
</script>

<div class="puzzle-container">
    {#await puzzle_promise}
        <Loading />
    {:then puzzle}
        <canvas id={Puzzle.puzzle_canvas_id}>
        </canvas>
        <div class="records-return-container" class:return-visible={return_records}>
            {#each return_records ?? [] as record}
                <div class="return-link">
                    <PageLink dest={{domain: "episodic", record_name: record}}>
                        <span class="return-link-text"><span class="uncovered-text">discovered</span> <strong>⤶ {Record.record_name_to_title(record)}</strong></span>
                    </PageLink>
                </div>
            {/each}
        </div>
    {/await}
</div>

<style>
    .puzzle-container {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }

    .records-return-container {
        position: fixed;
        height: 0;
        padding: 0;
        bottom: 0;
        width: 80%;
        background-color: rgba(255 255 255);
        border-radius: 5px;
        transition: height 0.5s ease-out, background-color 2.0s ease-out;
    }
    
    .records-return-container.return-visible {
        display: block;
        padding: 10px 30px;
        margin: 10px;
        height: 30px;
        border-top: 1px solid rgba(255 255 255 / 75%);
        border-left: 4px solid rgba(255 255 255 / 75%);
        border-right: 4px solid rgba(255 255 255255 / 75%);
        background-color: rgba(255 255 255 / 80%);
    }

    .uncovered-text {
        opacity: 0.5;
    }

    .return-link-text {
        height: 0;
        opacity: 0;
        transition: height 1.0s ease-out, opacity 1.0s ease-out;
        color: #000;
    }

    .return-visible .return-link-text {
        height: 1rem;
        opacity: 1;
    }
</style>