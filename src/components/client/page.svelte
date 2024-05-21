<script lang="ts">
    import Nav from "./nav.svelte";
    import View from "./view.svelte";
</script>

<div class="page">
    <div class="container">
        <Nav />
        <View />
    </div>
</div>

<style>
    .page {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
    }

    .container {
        display: flex;
        gap: 20px;
        width: 95vw;
        height: 95vh;
        justify-content: center;
        align-content: stretch;
        align-items: stretch;
    }

    :global(a) {
        color: white;
        text-decoration: none;
    }
</style>