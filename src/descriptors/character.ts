export const character_races = [
    "LLOKIN",
    "CHEVRIN",
    "VOLLUX",
    "NYXITE",
    "OSMITE",
    "UNIDENTIFIED",
] as const;
export type CharacterRace = (typeof character_races)[number];

export type CharacterTraits =
    | { 
        race: "LLOKIN",
        subrace?: "Rockbiter" | "Sunkissed",
        gender?: "female" | "male",
        colors?: {
            horns?: Array<string>,
            body?: Array<string>,
            eyes?: Array<string>,
        },
    } | {
        race: "CHEVRIN",
        subrace?: "Tundra" | "Glacierdweller",
        gender?: "female" | "male",
    }

export type Model = {
    name: string,
    traits: CharacterTraits,
};

export type SingleCharacterRequest = {
    name: string,
};
