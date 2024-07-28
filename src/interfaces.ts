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
    : typeof fields[key] 
}[keyof typeof fields];

export type FieldType<F> = 
F extends readonly [infer M, infer T] ? 
    M extends "optional_array"
        ? Array<FieldType<T>> | undefined : 
    M extends "required_array"
        ? Array<FieldType<T>> :
    M extends "optional_object"
        ? T extends {[key: string]: {type: any}} ? {[key in keyof T]: FieldType<T[key]["type"]> } | undefined : undefined :
    M extends "required_object"
        ? T extends {[key: string]: {type: any}} ? {[key in keyof T]: FieldType<T[key]["type"]> } : undefined :
    undefined :
F extends "optional_boolean" 
    ? boolean | undefined :
F extends "required_boolean"
    ? boolean :
F extends "optional_number" 
    ? number | undefined :
F extends "required_number"
    ? number :
F extends "optional_string"
    ? string | undefined :
F extends "required_string"
    ? string :
Record<string, never>;

export type TypeFromSchema<D extends {[key: string]: {type: any}}> = {[key in keyof D]: FieldType<D[key]["type"]>};
