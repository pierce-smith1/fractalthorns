<script lang="ts">
    import * as Fetchers from "../../../fetchers";
    import * as Episodic from "../../../descriptors/episodic";

    import Loading from '../loading.svelte';
    import RecordLine from "./record_line.svelte";

    export let name: string | undefined = undefined;
    export let line_index: number | undefined = undefined;

    $: record_entry_promise = Fetchers.get.single_record({name: name ?? "reservoir"});
    $: record_text_promise = Fetchers.get.record_text({name: name ?? "reservoir"});
    $: record_promise = Promise.all([record_entry_promise, record_text_promise]);
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
        font-size: 64px;
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