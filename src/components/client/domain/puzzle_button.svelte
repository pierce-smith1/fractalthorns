<script lang="ts">
    import * as Api from "../../../api/api.ts"

    import PageLink from "../page_link.svelte"

    import * as Page from "../page.svelte.ts"

    interface Props {
        puzzle: Api.PuzzleObject,
        prev_neighbor?: Api.PuzzleObject,
    }

    const {puzzle, prev_neighbor = undefined} = $props();

    function should_show_chapter(record: Api.PuzzleObject, prev?: Api.PuzzleObject) {
        return !prev || prev.chapter !== record.chapter;
    }

    function name_to_disply_title(name: string) {
        const title = name.replaceAll("-", " ");
        return title;
    }
</script>

{#if should_show_chapter(puzzle, prev_neighbor)}
    <h3 class="chapter-name">{puzzle.chapter}</h3>
{/if}
<PageLink dest={{domain: "discover", name: puzzle.name}} cause_layout_switch>
    <div class="puzzle-button" class:selected={Page.state.current.domain === "discover" && Page.state.current.name === puzzle.name} class:solved={puzzle.solved}>
        <span><strong class="puzzle-name">{name_to_disply_title(puzzle.name)}</strong></span>
    </div>
</PageLink>

<style>
    .puzzle-button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 5px;
        border: 1px solid rgba(255 255 255 / 50%);
        border-top: 2px solid rgba(255 255 255 / 50%);
        border-radius: 5px;
        height: 2.2rem;
        transition: background-color 0.2s ease-out;
    }

    .puzzle-button:hover {
        background-color: rgba(255 255 255 / 50%);
    }

    .selected {
        background-color: rgba(255 255 255 / 25%);
    }

    .solved {
        background-color: rgba(255 255 255 / 80%);
        color: #000;
    }

    .chapter-name {
        text-align: right;
        border-bottom: 1px solid rgba(255 255 255 / 50%);
        margin-bottom: 19px;
    }

    * {
        padding: 0;
        margin: 0;
    }
</style>
