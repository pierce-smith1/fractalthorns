export function speedpaint_id_to_url(id: string) {
    return `https://youtube.com/watch?v=${id}`;
}

// For images, and by extension news (So, TODO, this shouldn't be an "image
// helper"), I write dates in the format that I am familiar with and that 
// everyone else in my culture is familiar with: mm/dd/yyyy OR mm/dd/yy.
// However this is not how I want them served over the API, they should be ISO
// dates so that they are more universally understandable.
// This function exists to bridge the gap between the format I want to write
// dates in and format dates should be served to other people.
//
// JS's native date parsing will assume that dates not in ISO are in your local
// time zone, which is problematic when converting back to an ISO string,
// because ISO strings are always in UTC. Thus, when my redneck American dates
// are parsed and turned into ISO strings, they randomly lose a day. 
// I don't know a better way to solve this without pulling in some kind of time
// dependency - there almost certainly is one, but this works for now...
//
// https://github.com/pierce-smith1/fractalthorns/issues/4
export function american_to_iso_date(date: string) {
    // Some of the dates for images are written as just a year because I
    // couldn't find a more exact time. So this is a special handler for those.
    if (!date.includes("/")) {
        return `01-01-${date}`;
    }

    let [month, day, year] = date.split("/");

    year = year.length === 4
        ? year
        : `20${year}`; // Y 2.1 K

    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
}

export function get_image_url(name: string) {
    return `/serve/image/${name}`;
}

export function get_thumbnail_url(name: string) {
    return `/serve/thumb/${name}`;
}