import Db from "../data/db"

export type BaseRune = {
    name: string,
    data: Buffer,
};

export async function get_runes_for_runeword(runeword: string): Promise<Array<BaseRune>> {
    const rows = await Db
        .selectFrom("runeword_rune")
        .innerJoin("rune", "rune.name", "runeword_rune.rune_name")
        .innerJoin("file", "file.id", "rune.file_id")
        .select([
            "rune.name as name",
            "file.data as data",
        ])
        .where("runeword_rune.runeword_name", "=", runeword)
        .orderBy("runeword_rune.ordinal", "asc")
        .execute();

    return rows;
}
