export type Model = {
    title: string,
    type: "announcement" | "update",
    items?: Array<string>,
    date: Date,
    version: string,
};

export type ClientModel = Omit<Model, "date"> & {date: string};

export type AllNewsRequest = {};