import * as Endpoint from "../../../endpoint"
import * as TaleApi from "../../../api/tales"

export const GET = Endpoint.make_handler<"all_tales">("all_tales", async (request, override) => {
    // Tales are just hardcoded here instead of being in the database.
    // The two main reasons are:
    // 1. Tales really want to have their own fully fleshed out HTML pages rather
    //    than structured data which is later turned into an HTML page.
    //    This allows us to have a lot more freedom with how to display tales,
    //    which is important since they are all very distinct expressions,
    //    and it is MUCH better served as actual pages of the Astro application
    //    as opposed to HTML sitting around in a database.
    // 2. There is no risk of spoilers because tales are self-contained and
    //    released all at once, so one of the primary motivations for separating
    //    code and content simply isn't present here.

    const tales: Array<TaleApi.TaleEntry> = [{
        name: "tlh",
        title: "The Last Hiinean",
        canon: "auzoan",
        description: "searching for meaning after losing everything",
        date: "2024-04-15",
        page_url: "/story/the-last-hiinean",
    }, {
        name: "twoe",
        title: "The Weight of Earth",
        canon: "runic",
        description: "re-learning what it takes to make a difference",
        date: "2026-01-03",
        page_url: "/story/the-weight-of-earth",
    }];

    tales.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

    return {tales};
})
