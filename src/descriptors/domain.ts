export const domains = [
    "image",
    "episodic",
    "home",
    "tale", // we cannot call this "story" because that path already exists
    "subproject",
] as const;

export type Page = {
    domain: typeof domains[number],
    item?: string,
};

export function is_valid_domain(name?: string): name is Page["domain"] {
    if (!name) {
        return false;
    }

    const is_valid = domains.includes(name as Page["domain"]);
    return is_valid;
}

export function page_to_path(page: Page) {
    const path = `/${page.domain}/${page.item ?? ""}`;
    return path;
}

export function path_to_page(path: string): Page {
    const path_parts = path.split("/");
    const page = {
        domain: path_parts[1] as Page["domain"],
        item: path_parts[2],
    };
    return page;
}

export type Domain = {
    name: string,
    items: Array<string>,
};

export type DomainSearchRequest = string;