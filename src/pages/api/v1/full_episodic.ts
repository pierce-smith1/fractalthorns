import * as Endpoint from "../../../endpoint";
import * as EpisodicLoader from "../../../loaders/episodic";
import * as Episodic from "../../../descriptors/episodic";

export const GET = Endpoint.use_get_handler<"full_episodic">(async (request, override) => {
    const episodic = await EpisodicLoader.get_by_chapter();

    const episodic_redacted = episodic.map(chapter => ({
        name: chapter.chapter,
        records: chapter.records.map(Episodic.redact),
    }));

    return episodic_redacted;
});