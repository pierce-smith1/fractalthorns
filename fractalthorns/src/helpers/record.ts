export const narrator_character = "Narrator" as const;

export const iterations = [
    "154373",
    "209151",
    "265404",
    "768220",
    "768221",
    "auzoan",
    "event",
    "rhodon",
    "0",
];
export type Iteration = typeof iterations[number];

export function get_iteration_color(iteration: string | undefined): string {
    switch (iteration) {
        case "154373": return "#FFF8D1";
        case "209151": return "#51CDFF";
        case "265404": return "#FF8C1F";
        case "768220": return "#FF5588";
        case "768221": return "#E84CDB";
        case "auzoan": return "#4CE84C";
        case "event": return "#EA0042";
        case "rhodon": return "#FF3300";
        default:
        case "0": return "#888888";
    }
}

export function get_display_name(iteration: Iteration): string {
    switch (iteration) {
        case "154373": return "the eclipse's shadow";
        case "209151": return "the lightbloom constellation";
        case "265404": return "the surface";
        case "768220": return "the web";
        case "768221": return "the last universe";
        case "auzoan": return "auzoa";
        case "0": return "the grove";
        case "event": return "a special occasion";
        default: return iteration;
    }
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