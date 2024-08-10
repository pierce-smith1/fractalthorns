<script lang="ts">
    export let text: string;
</script>

<div class="tooltip-container" data-tooltip={text}>
    <slot/>
</div>

<style>
    .tooltip-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tooltip-container:hover:after {
        content: attr(data-tooltip);
        position: absolute;
        top: 0.2rem;
        border: 1px solid rgba(255 255 255 / 50%);
        border-radius: 5px;
        font-size: 1rem;
        color: var(--color, white);
        background: var(--background, black);
        padding: 0 5px 0 5px;
    }
</style>