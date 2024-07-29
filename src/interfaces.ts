export const fields = {
    optional_boolean: "optional_boolean",
    required_boolean: "required_boolean",
    optional_number: "optional_number",
    required_number: "required_number",
    optional_string: "optional_string",
    required_string: "required_string",
    optional_array: <T>(field_type: T) => ["optional_array", field_type] as const,
    required_array: <T>(field_type: T) => ["required_array", field_type] as const,
    optional_object: <T>(field_type: T) => ["optional_object", field_type] as const,
    required_object: <T>(field_type: T) => ["required_object", field_type] as const,
} as const;

export type FieldTypes = {[key in keyof typeof fields]: typeof fields[key] extends (...args: any) => any ? 
    ReturnType<typeof fields[key]>
: typeof fields[key]}[keyof typeof fields];

export type ObjectSchema = Record<string, {type: any, description?: string}>

export type TypeFromSchemaField<SchemaField> =
    SchemaField extends "optional_boolean" ? 
        boolean | undefined 
    : SchemaField extends "required_boolean" ? 
        boolean 
    : SchemaField extends "optional_number" ?
        number | undefined
    : SchemaField extends "required_number" ?
        number
    : SchemaField extends "optional_string" ?
        string | undefined
    : SchemaField extends "required_string" ?
        string
    : SchemaField extends readonly ["optional_array", infer InnerType] ?
        Array<TypeFromSchemaField<InnerType>> | undefined
    : SchemaField extends readonly ["required_array", infer InnerType] ?
        Array<TypeFromSchemaField<InnerType>>
    : SchemaField extends readonly ["optional_object", infer InnerType] ?
        (InnerType extends ObjectSchema ?
            TypeFromSchema<InnerType>
        : never) | undefined
    : SchemaField extends readonly ["required_object", infer InnerType] ?
        InnerType extends ObjectSchema ?
            TypeFromSchema<InnerType>
        : never
    : never;

export type TypeFromSchema<Schema extends ObjectSchema> =
    {[key in keyof Schema as Extract<TypeFromSchemaField<Schema[key]["type"]>, undefined> extends never ? never : key]?: 
        Exclude<TypeFromSchemaField<Schema[key]["type"]>, undefined>
    } & {[key in keyof Schema as Extract<TypeFromSchemaField<Schema[key]["type"]>, undefined> extends never ? key : never]: 
        TypeFromSchemaField<Schema[key]["type"]>
    };

const redactable_record_entry_schema = {
    solved: {
        type: fields.required_boolean,
        description: "Whether or not this record has been solved (will be true for everything except right after new chapters come out).",
    },
    chapter: {
        type: fields.required_string,
        description: "The chapter of this record.",
    },
    name: {
        type: fields.optional_string,
        description: "The identifying name of this record, i.e. the one found in URLs. Not present if the record is unsolved. Use this name to query for the text of the record via the `record_text` endpoint."
    },
    title: {
        type: fields.optional_string,
        description: "The display title of this record. Not present if the record is unsolved.",
    },
    iteration: {
        type: fields.optional_string,
        description: `The iteration this record takes place in. Not present if the record is unsolved.`,
    },
} as const;

type RRE = TypeFromSchema<typeof redactable_record_entry_schema>

