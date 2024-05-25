export type Model = {
    title: string,
    items?: Array<string>,
    date: Date,
    version?: string,
};

export type ClientModel = Omit<Model, "date"> & {date: string};

export type AllNewsRequest = {};