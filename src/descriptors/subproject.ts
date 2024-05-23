export type Model = {
    name: string,
    title: string,
    description: string,
};

// TODO
// Maybe this should be part of the API, but by its very nature
// this stuff is very tightly coupled to the site itself, so that
// is probably both very hard and not very useful.
export const subprojects: Array<Model> = [
    {
        name: "tlh",
        title: "The Last Hiinean",
        description: "a story about loss, identity, and loving oneself"
    },
    {
        name: "aor",
        title: "Aegis of Rhodon",
        description: "a (discontinued) idle game of exploration, growth, and death",
    },
    {
        name: "yokdeck",
        title: "Yokdeck",
        description: "a card pack for windows vista games",
    },
    {
        name: "yokscr",
        title: "yok.scr",
        description: "an illegal windows screensaver"
    },
];