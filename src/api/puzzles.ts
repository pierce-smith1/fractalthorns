import * as Interfaces from "../interfaces";

export const puzzle_solve_behavior_schema = {
    type: {
        type: Interfaces.fields.required_string,
        description: "One of `linked` or `increment`. If `linked`, this object's `linked_records` field will be present, and all records in that array will be unlocked when this puzzle is solved. If `increment`, the next unsolved record in the puzzle's chapter is unlocked."
    },
    linked_records: {
        type: Interfaces.fields.optional_array(Interfaces.fields.required_string),
        description: "A list of record names that will be unlocked when this record is solved. This is not present if the `type` is not `linked`."
    },
};

export const puzzle_object_schema = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The identitfying name of the puzzle.",
    },
    solved: {
        type: Interfaces.fields.optional_array(Interfaces.fields.required_string),
        description: "Present if this puzzle is solved. Holds a list of the names of the records that were unlocked when this was solved.",
    },
    chapter: {
        type: Interfaces.fields.required_string,
        description: "The chapter this puzzle is associated with.",
    },
    solve_behavior: {
        type: Interfaces.fields.required_object(puzzle_solve_behavior_schema),
        description: "What this puzzle does when it is solved.",
    },
    type: {
        type: Interfaces.fields.required_string,
        description: "One of `script` or `image`. If `script`, this is an interactive puzzle; if `image`, this is a static image.",
    },
    primary_color: {
        type: Interfaces.fields.required_string,
        description: "Reserved for private use."
    },
    secondary_color: {
        type: Interfaces.fields.required_string,
        description: "Reserved for private use."
    },
} as const;

export const puzzle_chapter_entry_schema = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The name of this chapter.",
    },
    puzzles: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(puzzle_object_schema)),
        description: "A list of all puzzles associated with this chapter.",
    },
} as const;

export const all_puzzles_request_schema = {} as const;

export const all_puzzles_response_schema = {
    chapters: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(puzzle_chapter_entry_schema)),
        description: "A list of all puzzles grouped by the chapter they are associated with.",
    },
} as const;

export const all_puzzles_endpoint = {
    description: "Get info for all puzzles.",
    request: all_puzzles_request_schema,
    response: all_puzzles_response_schema,
} as const;

export const single_puzzle_request_schema = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The identifying name of the puzzle (as acquired through the `all_puzzles` endpoint.)",
    },
} as const;

export const single_puzzle_response_schema = puzzle_object_schema;

export const single_puzzle_endpoint = {
    description: "Get info for a single puzzle",
    request: single_puzzle_request_schema,
    response: single_puzzle_response_schema,
};

export const solve_puzzle_request_schema = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The name of the puzzle to attempt to solve.",
    },
    code: {
        type: Interfaces.fields.required_string,
        description: "The code to solve the puzzle.",
    },
} as const;

export const solve_puzzle_response_schema = {
    unlocked_records: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "The records that were unlocked by solving this puzzle.",
    }
} as const;

export const solve_puzzle_endpoint = {
    method: "POST",
    description: "Try to solve a puzzle by providing its secret unlock code. If the code is correct OR the puzzle was already solved, this returns a 200 and the puzzle is ensured to be solved. Otherwise, it returns a 400.",
    request: solve_puzzle_request_schema,
    response: solve_puzzle_response_schema,
};

export type PuzzleObject = Interfaces.TypeFromSchema<typeof puzzle_object_schema>;
export type AllPuzzlesRequest = Interfaces.TypeFromSchema<typeof all_puzzles_request_schema>;
export type AllPuzzlesResponse = Interfaces.TypeFromSchema<typeof all_puzzles_response_schema>;
export type SinglePuzzleRequest = Interfaces.TypeFromSchema<typeof single_puzzle_request_schema>;
export type SinglePuzzleResponse = Interfaces.TypeFromSchema<typeof single_puzzle_response_schema>;
export type SolvePuzzleRequest = Interfaces.TypeFromSchema<typeof solve_puzzle_request_schema>;
export type SolvePuzzleResponse = Interfaces.TypeFromSchema<typeof solve_puzzle_response_schema>;
