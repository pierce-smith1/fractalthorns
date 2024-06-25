export type RecordEntry = {
    chapter: string,
    name: string,
    title: string,
    solved: boolean,
    iteration: string,
};

export type Model = {
    records: Array<RecordEntry>,
};
