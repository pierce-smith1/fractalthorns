<script lang="ts">
    import {onMount} from "svelte";

    import * as Subproject from "../../../descriptors/subproject";
    import * as GenericUtil from "../../../genericutil.ts";
    import * as Nav from "../nav";
    import * as Fetchers from "../../../fetchers.ts";

    import Tlh from "./subprojects/tlh.svelte";
    import Aor from "./subprojects/aor.svelte";
    import Yokdeck from "./subprojects/yokdeck.svelte";
    import Yokscr from "./subprojects/yokscr.svelte";
    import Keynav from "./keynav.svelte";

    export let name: string | undefined;

    $: subproject_index = Subproject.subprojects.findIndex(sp => sp.name === name);
    $: [prev_subproject, next_subproject] = GenericUtil.neighbors(subproject_index, Subproject.subprojects);

    onMount(() => {
        Nav.set_domain_items("subproject");
    });
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
{#await Fetchers.get.full_episodic({})}
{:then episodic}
    <Keynav 
        page_up={{domain: "subproject", name: prev_subproject.name}}
        page_down={{domain: "subproject", name: next_subproject.name}}
        page_left={{domain: "episodic", record_name: episodic[0].records[0].name ?? ""}}
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
