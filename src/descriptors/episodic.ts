export type RecordEntry = {
    chapter: string,
    name: string,
    title: string,
    solved: boolean,
    iteration: string,
}
export type RedactableRecordEntry = Omit<RecordEntry, "name"> & {name?: string, title?: string}

export type Model = {
    records: Array<RecordEntry>,
};

export type ClientModel = Array<{name: string, records: Array<RedactableRecordEntry>}>;

export type FullEpisodicRequest = {}; 
export type SingleRecordRequest = {
    name: string,
};

export type SolveRecordRequest = {
    name: string,
};

export function get_iteration_sigil(iteration: string): string | undefined {
    switch (iteration) {
        case "154373": return "⎊";
        case "209151": return "◇";
        case "265404": return "△";
        case "768220": return "⧉";
        case "768221": return "⬡";
        case "auzoan": return "∂";
        case "event": return "⌘";
        case "0": return "∅";
    }
}

export function get_iteration_color(iteration: string): string | undefined {
    switch (iteration) {
        case "154373": return "#FFF8D1";
        case "209151": return "#00FFED";
        case "265404": return "#FFC67C";
        case "768220": return "#FF5588";
        case "768221": return "#E84CDB";
        case "auzoan": return "#E84CDB";
        case "event": return "#EA0042";
        case "0": return "#000000";
    }
}
