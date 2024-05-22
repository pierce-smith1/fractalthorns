export type Model = {
    title: string,
    type: "announcement" | "update",
    items?: Array<string>,
    date: Date,
};

export type ClientModel = Omit<Model, "date"> & {date: string};

export type AllNewsRequest = {};