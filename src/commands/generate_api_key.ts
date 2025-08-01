import * as ApiKeyQueries from "../queries/api_key"

const subject_name = process.argv[2];
if (!subject_name) {
    console.error("Provide a subject name");
} else {
    const new_key = await ApiKeyQueries.add_key(subject_name);
    console.log(new_key);
}
