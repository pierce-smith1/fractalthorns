<script lang="ts">
</script>

<button on:click class="glass-button" type="button">
    <slot />
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

    .glass-button:hover {
        color: black;
        background-color: white;
    }
</style>
