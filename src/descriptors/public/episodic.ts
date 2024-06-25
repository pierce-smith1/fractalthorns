import * as Interfaces from "../../interfaces";
import * as Episodic from "../episodic";

export const redactable_record_entry = {
    chapter: {
        type: Interfaces.fields.required_string,
        description: "The chapter of this record.",
    },
    name: {
        type: Interfaces.fields.optional_string,
        description: "The identifying name of this record, i.e. the one found in URLs. Not present if the record is unsolved. Use this name to query for the text of the record via the `record_text` endpoint."
    },
    title: {
        type: Interfaces.fields.optional_string,
        description: "The display title of this record. Not present if the record is unsolved.",
    },
    solved: {
        type: Interfaces.fields.required_boolean,
        description: "Whether or not this record has been solved (will be true for everything except right after new chapters come out).",
    },
    iteration: {
        type: Interfaces.fields.optional_string,
        description: `The iteration this record takes place in. Not present if the record is unsolved.`,
    },
} as const;
export type RedactableRecordEntry = Interfaces.ModelFromInterface<typeof redactable_record_entry>;

export const chapter_entry = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The name of this chapter.",
    },
    records: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(redactable_record_entry)),
        description: "The records in this chapter.",
    },
} as const;
export type ChapterEntry = Interfaces.ModelFromInterface<typeof chapter_entry>;

export const full_episodic_request = {} as const;
export type FullEpisodicRequest = Interfaces.ModelFromInterface<typeof full_episodic_request>;

export const single_record_request = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The name of the record to get info for. Use names gathered from the `name` field of the entries provided by `full_episodic`.",
    },
} as const;

export function redact(entry: Episodic.RecordEntry): RedactableRecordEntry {
    if (entry.solved) {
        return entry;
    }

    return {...entry,
        name: undefined,
        title: undefined,
        iteration: undefined,
    };
}

export const iterations = [
    "154373",
    "209151",
    "265404",
    "768220",
    "768221",
    "auzoan",
    "event",
    "0",
];
export type Iteration = typeof iterations[number];

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

export function get_iteration_color(iteration: string | undefined): string {
    switch (iteration) {
        case "154373": return "#FFF8D1";
        case "209151": return "#51CDFF";
        case "265404": return "#FF8C1F";
        case "768220": return "#FF5588";
        case "768221": return "#E84CDB";
        case "auzoan": return "#4CE84C";
        case "event": return "#EA0042";
        case "0": return "#888888";
    }
    return "#888888";
}

// TODO maybe(?) this should be handled by the character API,
// but not having an API for this saves us net requests and honestly
// the character API may not be a thing anyone needs, so :shrug:
// Plus it's different than just a list of characters anyway
export const mnemonic_keywords = [
    "AURAK",
    "MEFET",
    "YANIS",
    "TARAN",
    "IGLAS",
    "WARES",
    "RIMAN",
    "NERAN",
    "COLUS",
    "CALEN",
    "CASEI",
    "ALUSE",
    "SETEI",
    "ERISS",
    "FEREI",
    "YARUS",
    "IWEML",
    "DESSA",
    "WEHAN",
    "FENAN",
    "TACEK",
    "ZEHAL",
    "VETTE",
    "KIRII",
    "METIS",
    "LOTUS",
    "RUTHA",
    "MELLI",
    "AEMIL",
    "SILLH",
    "LOXXE",
    "DZUNE",
    "DZANE",
    "MAEIN",
    "KIEAZ",
    "KALLI",
    "KRYTA",
    "EVJAR",
    "ROMAL",
    "JAELA",
    "TIMUR",
    "NIMEA",
    "KEZSE",
    "ARILI",
    "AERIS",
    "MALDA",
    "KHYEL",
    "HESSE",
    "HEKAE",
    "TIZAJ",
    "MIKIL",
    "VESES",
    "KIERA",
    "NDEJA",
    "KARUS",
    "VANJE",
    "HAGAZ",
    "SENNA",
    "ELLAI",
    "MEAZS",
    "JAKAL",
    "MEDZA",
    "REAME",
    "KAELI",
    "LLEMA",
    "TEKAL",
    "RIMII",
    "TEZEL",
    "KAVUK",
    "SELTE",
    "LEZSE",
    "KAEZA",
    "SHAEL",
    "JERGH",
    "VAEJA",
    "IOGOS",
    "NETRE",
    "NIMDA",
    "CYXYM",
    "OEREC",
    "VITAS",
    "RIGEL",
    "RHOMB",
    "NYXEM",
    "ZELUN",
    "HALEN",
    "NITAS",
    "VERCE",
    "VERDE",
    "VIBRA",
    "VERTI",
    "ZSUNG",
    "GIMEL",
    "KRAZA",
    "DEJIL",
    "EMBER",
    "BEAST",
    "SIGIL",
    "FLOAT",
    "QUARK",
    "PLUTO",
    "PEARL",
    "OCHRE",
    "EYKWYRM",
    "VOLLUX",
    "LLOKIN",
    "CHEVRIN",
    "NYXITE",
    "COVALUS",
    "OSMITE",
    "BEMITE",
    "MEADOW",
    "AETOL",
    "KELASH",
    "NGATAJ",
    "GOAXAL",
    "ENM",
    "SILVER"
];