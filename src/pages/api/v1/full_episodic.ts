import * as Endpoint from "../../../endpoint";
import Records from "../../../stores/record";
import * as RecordTransformers from "../../../transformers/record";

export const GET = Endpoint.use_get_handler<"full_episodic">(async (request, override) => {
    const episodic = Records.get();

    const episodic_redacted = RecordTransformers.to_chapter_entries(episodic);

    return {chapters: episodic_redacted};
});