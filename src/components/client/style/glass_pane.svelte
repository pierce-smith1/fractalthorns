<script lang="ts">
    export let title: string | undefined = undefined;
    export let title_bar: boolean = true;
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
        <slot />
    </div>
</div>

<style>
    .pane-container {
        display: flex;
        flex-flow: column nowrap;
        min-height: 0;
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
        border: 1px solid white;
        border-radius: 0 0 5px 5px;
        background-color: rgba(0 0 0 / 50%);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    .no-titlebar {
        border-radius: 5px;
    }

    .title {
        color: rgba(0 0 0 / 50%);
        font-size: 0.9em;
    }
</style>
