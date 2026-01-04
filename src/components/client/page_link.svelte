<script lang="ts">
    import * as Svelte from "svelte"

    import * as Domain from "../../helpers/domain.ts"
    import * as Nav from "./nav.svelte.ts"
    import * as Page from "./page.svelte.ts"

    let {
        dest,
        cause_layout_switch = false,
        children,
    }: {
        dest: Domain.Page,
        cause_layout_switch?: boolean,
        children?: Svelte.Snippet,
    } = $props();

    async function onclick(event: MouseEvent) {
        event.preventDefault();

        window.history.pushState(JSON.stringify(dest), "", Domain.page_to_path(dest));

        await navigate(dest);
    }

    async function navigate(dest: Domain.Page) {
        const actual_dest = Nav.is_incomplete_page(dest)
            ? await Nav.get_landing_page(dest.domain)
            : dest;

        Page.state.current = actual_dest;

        if (cause_layout_switch && Page.state.layout !== "full") {
            Page.state.layout = "only-page";
        }

        Nav.set_domain_items(Nav.state, dest.domain);
    }

    window.onpopstate = async (event: PopStateEvent) => {
        const dest = JSON.parse(event.state) as Domain.Page;
        await navigate(dest);
    };
</script>

<a href={Domain.page_to_path(dest)} {onclick}>
    {#if children}
        {@render children()}
    {/if}
</a>
