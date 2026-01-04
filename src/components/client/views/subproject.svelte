<script lang="ts">
    import Keynav from "./keynav.svelte";
    import Aor from "./subprojects/aor.svelte";
    import Yokdeck from "./subprojects/yokdeck.svelte";
    import Yokscr from "./subprojects/yokscr.svelte";

    let {name}: {
        name?: string
    } = $props();
</script>

<div class="subproject-container" class:full={name === "tlh"}>
    {#if name === "aor"}
        <Aor />
    {:else if name === "yokdeck"}
        <Yokdeck />
    {:else if name === "yokscr"}
        <Yokscr />
    {/if}
</div>

<Keynav
    page_left={{domain: "tale"}}
/>

<style>
    .subproject-container {
        width: 80%;
        height: 100%;
        margin: auto;
        overflow-y: scroll;
        scrollbar-width: none;
    }

    .full {
        width: 100%;
        overflow-y: hidden; /* TODO fuck this and fuck you nvidia */
    }

    .subproject-container :global(*) {
        color: white;
    }

    .subproject-container :global(a) {
        text-decoration: underline;
    }

    .subproject-container :global(h1) {
        border-bottom: 2px solid rgba(255 255 255 / 50%);
    }
</style>
