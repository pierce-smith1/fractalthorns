<script lang="ts">
    import * as Fetchers from "../../fetchers";

    import Loading from "./loading.svelte";

    const news_promise = Fetchers.get.all_news({});

    function extract_subitem_parts(subitem: string) {
        const subitem_type_regex = /^\((\w+)\)/i;

        const subitem_type_match = subitem.match(subitem_type_regex);
        const subitem_type = subitem_type_match && subitem_type_match.length > 1 ? 
            subitem_type_match[1] 
            : undefined;

        const subitem_text = subitem_type ?
            subitem.replace(subitem_type_regex, "|").trim()
            : subitem;

        return {type: subitem_type, text: subitem_text};
    }
</script>

<div class="news-container">
    <h2 class="news-title">news</h2>
    {#await news_promise}
        <Loading />
    {:then news} 
        <div class="news-items">
            {#each news.items as item}
                <div class="news-item">
                    <h4>{item.date}</h4>
                    <p>{item.title}</p>
                    {#if item.items && item.items.length > 0}
                        <ul>
                            {#each item.items ?? [] as subitem}
                                <li>
                                    <strong>{extract_subitem_parts(subitem).type ?? ""}</strong>
                                    {extract_subitem_parts(subitem).text}
                                </li>
                            {/each}
                        </ul>
                    {/if}
                    {#if item.version}
                        <p class="version">{item.version}</p>
                    {/if}
                </div>
            {/each}
        </div>
    {/await}
</div>

<style>
    .news-container {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 10px;
    }

    .news-title {
        margin-bottom: 20px;
        line-height: 0;
    }

    .news-items {
        width: 100%;
        flex-grow: 5;
    }

    .news-item {
        border-left: 2px solid rgba(255 255 255 / 50%);
        padding: 10px;
        margin: 10px;
    }

    .version {
        color: rgba(255 255 255 / 50%);
        font-size: 0.7em;
    }

    h4, p, span {
        padding: 0;
        margin: 0;
    }

    ul {
        margin: 0;
        padding-left: 1rem;
        list-style-type: none;
    }

    li {
        padding: 5px 0 5px 0;
    }
</style>