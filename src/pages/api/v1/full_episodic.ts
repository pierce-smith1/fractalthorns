import * as Endpoint from "../../../endpoint";
import * as RecordQueries from "../../../queries/record";

export const GET = Endpoint.make_handler<"full_episodic">(async (request, override) => {
    const records = await RecordQueries.get_all_entries();

    const rows_by_chapter = Object.groupBy(records, record => record.chapter);

    const chapters = Object.entries(rows_by_chapter).map(([chapter, records]) => ({
        name: chapter,
        records: records ?? [],
    }));

    return {chapters};
});