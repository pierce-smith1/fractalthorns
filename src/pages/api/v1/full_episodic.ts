import * as Endpoint from "../../../endpoint";
import * as EpisodicLoader from "../../../loaders/episodic";

export const GET = Endpoint.use_get_handler<"full_episodic">(async (request, override) => {
    const episodic = await EpisodicLoader.get_by_chapter();

    const episodic_redacted = episodic.map(chapter => ({
        name: chapter.chapter,
        records: chapter.records.map(record => ({...record,
            name: record.solved ? record.name : undefined,
        })),
    }));

    return episodic_redacted;
});