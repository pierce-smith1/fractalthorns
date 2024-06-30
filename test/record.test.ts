import * as Vitest from "vitest";

import * as RecordLoader from "../src/loaders/record";

const example_record = `{{iter=209151,fmt=poem}}
Record ordered on behalf of the NSIrP

<                                                                     >
< sabre                                                               >
<                                                                     >
< currently translating                                               >
< iteration[768221].nyxite.un -> iteration[197420].human.english      >
< iteration[265404].llokin.aetol -> iteration[197420].human.english   >
< iteration[265404].llokin.kelash -> iteration[197420].human.english  >
< iteration[265404].chevrin.goaxal -> iteration[197420].human.english >
< iteration[209151].vollux.enm -> iteration[197420].human.english     >
<                                                                     >
< [ note                                                              >
< [ multiple words are untranslatable                                 >
< [ untranslatable words have been replaced with MNEMONICS            >
<                                                                     >
< [ note                                                              >
< [ this translation set is especially difficult                      >
< [ sentences may be nonsensical in the target language               >
<                                                                     >

< don't be mistaken for the header >
< another one for good measure >

OEREC : This should be in UN
OEREC : This too

KIERA : This also
KIERA : even though
I am
a different
character

OEREC (worried) : This too, even though it has emphasis
OEREC (in SOMETHING ELSE) : Now we switch languages

Someone With A Long Name : Now, in that same language...
Someone With A Long Name :

This whole block line
should be one line
with the same language and speaker
even though
there are a lot
of line breaks

LOTUS (in AETOL) (excited) : A lot?
LOTUS (excited) (in KELASH) : It shouldn't matter whether the langauge or emphasis comes first

< forget about me? >

LOTUS : < no! >

LOTUS :

Lots of line breaks again...

This is technically a different line though.

_ :

Narrator line

_ : Narrator line, but inline

< record ends >
`;


Vitest.test("RecordLoader.parse_from", () => {
    const parsed_example = RecordLoader.parse_from(example_record);

    Vitest.assert(parsed_example.characters.length === 5);
    Vitest.assert(parsed_example.characters.find(c => c.toLowerCase() === "oerec"));
    Vitest.assert(parsed_example.characters.find(c => c.toLowerCase() === "kiera"));
    Vitest.assert(parsed_example.characters.find(c => c.toLowerCase() === "someone with a long name"));
    Vitest.assert(parsed_example.characters.find(c => c.toLowerCase() === "lotus"));
    Vitest.assert(parsed_example.characters.find(c => c.toLowerCase() === "narrator"));

    Vitest.assert(parsed_example.languages.length === 6);
    Vitest.assert(parsed_example.languages.find(c => c.toLowerCase() === "un"));
    Vitest.assert(parsed_example.languages.find(c => c.toLowerCase() === "aetol"));
    Vitest.assert(parsed_example.languages.find(c => c.toLowerCase() === "kelash"));
    Vitest.assert(parsed_example.languages.find(c => c.toLowerCase() === "goaxal"));
    Vitest.assert(parsed_example.languages.find(c => c.toLowerCase() === "enm"));
    Vitest.assert(parsed_example.languages.find(c => c.toLowerCase() === "something else"));

    Vitest.assert(parsed_example.header_lines.length === 18);

    Vitest.assert(parsed_example.options["iter"] === "209151");
    Vitest.assert(parsed_example.options["fmt"] === "poem");

    Vitest.assert(parsed_example.requested);

    Vitest.assert(parsed_example.lines.length === 19);

    Vitest.assert(parsed_example.lines[0].type === "Sabre");
    // trust that the text is right

    Vitest.assert(parsed_example.lines[1].type === "Sabre");

    Vitest.assert(parsed_example.lines[2].type === "Inline");
    Vitest.assert(parsed_example.lines[2].character?.toLowerCase() === "oerec");
    Vitest.assert(parsed_example.lines[2].language?.toLowerCase() === "un");
    Vitest.assert(parsed_example.lines[2].emphasis === undefined);

    Vitest.assert(parsed_example.lines[3].type === "Inline");
    Vitest.assert(parsed_example.lines[3].character?.toLowerCase() === "oerec");
    Vitest.assert(parsed_example.lines[3].language?.toLowerCase() === "un");
    Vitest.assert(parsed_example.lines[3].emphasis === undefined);

    Vitest.assert(parsed_example.lines[4].type === "Inline");
    Vitest.assert(parsed_example.lines[4].character?.toLowerCase() === "kiera");
    Vitest.assert(parsed_example.lines[4].language?.toLowerCase() === "un");
    Vitest.assert(parsed_example.lines[4].emphasis === undefined);

    Vitest.assert(parsed_example.lines[5].type === "Inline");
    Vitest.assert(parsed_example.lines[5].character?.toLowerCase() === "kiera");
    Vitest.assert(parsed_example.lines[5].language?.toLowerCase() === "un");
    Vitest.assert(parsed_example.lines[5].emphasis === undefined);

    Vitest.assert(parsed_example.lines[6].type === "Inline");
    Vitest.assert(parsed_example.lines[6].character?.toLowerCase() === "oerec");
    Vitest.assert(parsed_example.lines[6].language?.toLowerCase() === "un");
    Vitest.assert(parsed_example.lines[6].emphasis?.toLowerCase() === "worried");

    Vitest.assert(parsed_example.lines[7].type === "Inline");
    Vitest.assert(parsed_example.lines[7].character?.toLowerCase() === "oerec");
    Vitest.assert(parsed_example.lines[7].language?.toLowerCase() === "something else");
    Vitest.assert(parsed_example.lines[7].emphasis === undefined);

    Vitest.assert(parsed_example.lines[8].type === "Inline");
    Vitest.assert(parsed_example.lines[8].character?.toLowerCase() === "someone with a long name");
    Vitest.assert(parsed_example.lines[8].language?.toLowerCase() === "something else");
    Vitest.assert(parsed_example.lines[8].emphasis === undefined);

    Vitest.assert(parsed_example.lines[9].type === "Block");
    Vitest.assert(parsed_example.lines[9].character?.toLowerCase() === "someone with a long name");
    Vitest.assert(parsed_example.lines[9].language?.toLowerCase() === "something else");
    Vitest.assert(parsed_example.lines[9].emphasis === undefined);

    Vitest.assert(parsed_example.lines[10].type === "Inline");
    Vitest.assert(parsed_example.lines[10].character?.toLowerCase() === "lotus");
    Vitest.assert(parsed_example.lines[10].language?.toLowerCase() === "aetol");
    Vitest.assert(parsed_example.lines[10].emphasis?.toLowerCase() === "excited");

    Vitest.assert(parsed_example.lines[11].type === "Inline");
    Vitest.assert(parsed_example.lines[11].character?.toLowerCase() === "lotus");
    Vitest.assert(parsed_example.lines[11].language?.toLowerCase() === "kelash");
    Vitest.assert(parsed_example.lines[11].emphasis?.toLowerCase() === "excited");

    Vitest.assert(parsed_example.lines[12].type === "Sabre");

    Vitest.assert(parsed_example.lines[13].type === "Inline");
    Vitest.assert(parsed_example.lines[13].character?.toLowerCase() === "lotus");
    Vitest.assert(parsed_example.lines[13].language?.toLowerCase() === "kelash");
    Vitest.assert(parsed_example.lines[13].emphasis === undefined);

    Vitest.assert(parsed_example.lines[14].type === "Block");
    Vitest.assert(parsed_example.lines[14].character?.toLowerCase() === "lotus");
    Vitest.assert(parsed_example.lines[14].language?.toLowerCase() === "kelash");
    Vitest.assert(parsed_example.lines[14].emphasis === undefined);

    Vitest.assert(parsed_example.lines[15].type === "Block");
    Vitest.assert(parsed_example.lines[15].character?.toLowerCase() === "lotus");
    Vitest.assert(parsed_example.lines[15].language?.toLowerCase() === "kelash");
    Vitest.assert(parsed_example.lines[15].emphasis === undefined);

    Vitest.assert(parsed_example.lines[16].type === "Block");
    Vitest.assert(parsed_example.lines[16].character?.toLowerCase() === "narrator");
    Vitest.assert(parsed_example.lines[16].language?.toLowerCase() === "kelash");
    Vitest.assert(parsed_example.lines[16].emphasis === undefined);

    Vitest.assert(parsed_example.lines[17].type === "Inline");
    Vitest.assert(parsed_example.lines[17].character?.toLowerCase() === "narrator");
    Vitest.assert(parsed_example.lines[17].language?.toLowerCase() === "kelash");
    Vitest.assert(parsed_example.lines[17].emphasis === undefined);

    Vitest.assert(parsed_example.lines[18].type === "Sabre");
});