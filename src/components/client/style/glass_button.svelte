<script lang="ts">
    import * as Svelte from "svelte"
    import type { MouseEventHandler } from "svelte/elements";

    let props: {
        children: Svelte.Snippet,
        onclick: MouseEventHandler<HTMLButtonElement>,
        borderless?: boolean,
    } = $props();
</script>

<button
    onclick={props.onclick}
    class="glass-button"
    class:borderless={props.borderless}
    type="button"
>
    {@render props.children()}
</button>

<style>
    .glass-button {
        display: flex;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        min-height: 30px;
        background: none;
        border: 1px solid white;
        color: white;
        border-radius: 5px;
        transition: background-color 0.2s ease-out, color 0.2s ease-out;
        font-size: 16px;
        padding: 2px 10px 2px 10px;
    }

    .borderless {
        border: none;
    }

    .glass-button:hover {
        color: black;
        background-color: white;
    }
</style>
