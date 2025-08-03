<script lang="ts">
    import * as Svelte from "svelte"

    let {
        title = undefined,
        title_bar = true,
        children,
    }: {
        title?: string,
        title_bar?: boolean,
        children: Svelte.Snippet,
    } = $props();
</script>

<div class="pane-container">
    {#if title_bar}
        <div class="pane-titlebar">
            {#if title}
                <span class="title">{title}</span>
            {/if}
        </div>
    {/if}
    <div class="pane-contents" class:no-titlebar={!title_bar}>
        {@render children()}
    </div>
</div>

<style>
    .pane-container {
        display: flex;
        flex-flow: column nowrap;
        min-height: 0;
        height: 100%;
        max-height: 100%;
    }

    .pane-titlebar {
        display: flex;
        justify-content: flex-end;
        padding-right: 8px;
        align-items: center;
        max-height: 20px;
        min-height: 20px;
        background-color: white;
        border-radius: 5px 5px 0 0;
    }

    .pane-contents {
        contain: paint;
        flex-grow: 1;
        border: 1px solid white;
        overflow: hidden;
        border-radius: 0 0 5px 5px;
        background-color: var(--background-color, rgba(0 0 0 / 50%));
        backdrop-filter: blur(var(--blur-amount, 10px));
        -webkit-backdrop-filter: blur(var(--blur-amount, 10px));
    }

    .no-titlebar {
        border-radius: 5px;
    }

    .title {
        color: rgba(0 0 0 / 50%);
        font-size: 0.9em;
    }
</style>
