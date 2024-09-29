import * as Endpoint from "../../../endpoint";
import * as RecordLoader from "../../../loaders/record";
import * as RecordTransformers from "../../../transformers/record";

export const GET = Endpoint.use_get_handler<"full_episodic">(async (request, override) => {
    const episodic = await RecordLoader.load_all();

    const episodic_redacted = RecordTransformers.to_chapter_entries(episodic);

    return {chapters: episodic_redacted};
});