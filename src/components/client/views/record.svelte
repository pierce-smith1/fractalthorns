<script lang="ts">
    import {onMount} from "svelte";

    import * as Fetchers from "../../../fetchers";
    import * as Nav from "../nav";

    import Loading from '../loading.svelte';
    import RecordLine from "./record_line.svelte";
    import Keynav from "./keynav.svelte";

    export let name: string | undefined = undefined;
    export let line_index: number | undefined = undefined;

    $: record_entry_promise = Fetchers.get.single_record({name: name ?? "reservoir"});
    $: record_text_promise = Fetchers.get.record_text({name: name ?? "reservoir"});
    $: record_promise = Promise.all([record_entry_promise, record_text_promise]);

    onMount(() => {
        Nav.set_domain_items("episodic");
    });
</script>

<div class="record-container">
    {#await record_promise}
        <Loading />
    {:then [entry, text]}
        <div class="record-text-container">
            <h1 class="record-title">
                <img class="title-sigil" src={`/assets/images/common/iteration-${entry.iteration}.png`} />
                {entry.title}
            </h1>
            <pre class="record-header">{text.header_lines.join("\n")}</pre>
            <div class="record-body-container">
                {#each text.lines as line, i}
                    <RecordLine 
                        {line} 
                        last_line={i > 0 ? text.lines[i - 1] : undefined} 
                        record={text} 
                        line_index={i} 
                        requested_line_index={line_index}
                    />
                {/each}
            </div>
        </div>
    {/await}
</div>
{#await Fetchers.get.single_image({})}
{:then image}
    <Keynav
        page_left={{domain: "image", name: image.name}}
        page_right={{domain: "subproject"}}
    />
{/await}

<style>
    .record-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .record-text-container {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        width: 50%;
    }

    .record-header {
        width: 100%;
        text-align: center;
        padding-bottom: 13px;
        border-bottom: 2px solid rgba(255 255 255 / 50%);
    }

    .record-body-container {
        position: relative;
        width: 100%;
        margin-left: 100px;
        display: flex;
        flex-flow: column nowrap;
        margin-bottom: 15px;
    }

    * {
        color: black;
    }

    h1 {
        font-family: "eczar";
        font-size: 3vw;
        padding: 30px 0 30px 0;
        margin: 0;
        line-height: 70px;
        text-align: center;
    }

    .title-sigil {
        position: relative;
        top: 5px;
        width: 40px;
    }
</style>