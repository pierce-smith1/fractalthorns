export type Model = {
    title: string,
    items?: Array<string>,
    date: Date,
};

export type ClientModel = Omit<Model, "date"> & {date: string};

export type AllNewsRequest = {};