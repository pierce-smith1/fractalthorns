<script lang="ts">
    import * as Fetchers from "../../../fetchers.ts";

    import Keynav from "./keynav.svelte";
    import Aor from "./subprojects/aor.svelte";
    import Tlh from "./subprojects/tlh.svelte";
    import Yokdeck from "./subprojects/yokdeck.svelte";
    import Yokscr from "./subprojects/yokscr.svelte";

    export let name: string | undefined;
</script>

<div class="subproject-container" class:full={name === "tlh"}>
    {#if name === "tlh"}
        <Tlh />
    {:else if name === "aor"}
        <Aor />
    {:else if name === "yokdeck"}
        <Yokdeck />
    {:else if name === "yokscr"}
        <Yokscr />
    {/if}
</div>
{#await Promise.all([Fetchers.get.full_episodic({}), Fetchers.get.all_sketches({})])}
{:then [episodic, sketches]}
    <Keynav 
        page_left={{domain: "episodic", record_name: episodic.chapters[0].records[0].name ?? ""}}
        page_right={{domain: "sketch", name: sketches.sketches[0].name}}
    />
{/await}

<style>
    .subproject-container {
        width: 80%;
        height: 100%;
        margin: auto;
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
