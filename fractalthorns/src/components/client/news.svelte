<script lang="ts">
    import * as Fetchers from "../../fetchers";
    import * as ImageHelpers from "../../helpers/image";
    import * as Admin from "./admin";

    import Loading from "./loading.svelte";

    import {marked} from "marked";

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

    async function broadcast_notification() {
        const admin_key = Admin.get_stored_key();
        if (!admin_key) {
            return;
        }

        const latest_item = (await news_promise).items[0];

        fetch("/notifications", {
            method: "POST",
            headers: {
                "ft-admin-key": admin_key,
            },
            body: `news_update/${JSON.stringify(latest_item)}`,
        });
    }
</script>

<div class="news-container">
    <h2 class="news-title">news</h2>
    {#await news_promise}
        <Loading />
    {:then news} 
        {#if Admin.get_stored_key()}
            <button type="button" class="admin-notify-button" on:click={broadcast_notification}>notify</button>
        {/if}
        <div class="news-items">
            {#each news.items as item}
                <div class="news-item">
                    <h4>{ImageHelpers.get_date_string(item.date)}</h4>
                    <p>{item.title}</p>
                    {#if item.items && item.items.length > 0}
                        <ul>
                            {#each item.items ?? [] as subitem}
                                <li>
                                    <strong>{extract_subitem_parts(subitem).type ?? ""}</strong>
                                    {@html marked.parse(extract_subitem_parts(subitem).text)}
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
        padding: 0;
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

    h4, p, span, :global(p) {
        padding: 0;
        margin: 0;
    }

    /* Gets around markdown adding line breaks where I don't want them because of added <p> tags */
    :global(p) {
        display: inline;
    }

    ul {
        margin: 0;
        padding-left: 1rem;
        list-style-type: none;
    }

    li {
        padding: 5px 0 5px 0;
    }

    li :global(a) {
        text-decoration: underline;
    }

    .admin-notify-button {
        width: 80%;
        border: 1px solid orangered;
        border-radius: 5px;
        background: none;
        color: white;
        transition: background 0.2s ease-out, color 0.2s ease-out;
    }

    .admin-notify-button:hover {
        background: orangered;
        color: black;
    }
</style>