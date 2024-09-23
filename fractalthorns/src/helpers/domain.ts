import * as Api from "../api";

export const domains = [
    "image",
    "sketch",
    "episodic",
    "home",
    "subproject",
] as const;

export type Domain = typeof domains[number];

export type Page =
    | {domain: "image", name: string}
    | {domain: "sketch", name: string}
    | {domain: "episodic", record_name: string, line_index?: number}
    | {domain: "home"}
    | {domain: "subproject", name?: string}

export type Item = 
    | {domain: "image", image: Exclude<Api.DomainSearchResult["image"], undefined>}
    | {domain: "sketch", sketch: Api.SketchObject}
    | {domain: "episodic-item", record: Exclude<Api.DomainSearchResult["record"], undefined>}
    | {
        domain: "episodic-line", 
        record: Exclude<Api.DomainSearchResult["record"], undefined>, 
        matched_text: Exclude<Api.DomainSearchResult["record_matched_text"], undefined>,
        line_index: Exclude<Api.DomainSearchResult["record_line_index"], undefined>,
    }
    | {domain: "subproject", name?: string}

export type SearchItemType =
    | "image"
    | "episodic-item"
    | "episodic-line"

export function result_to_item(result: Api.DomainSearchResult): Item {
    switch (result.type) {
        case "image": return {domain: result.type, image: result.image!};
        case "episodic-item": return {domain: result.type, record: result.record!}; 
        case "episodic-line": return {domain: result.type, record: result.record!, matched_text: result.record_matched_text!, line_index: result.record_line_index!};
    }

    return undefined!;
}

export function item_to_result(item: Item): Api.DomainSearchResult {
    const empty = {image: undefined, record: undefined, record_matched_text: undefined, record_line_index: undefined};

    switch (item.domain) {
        case "image": return {...empty, type: item.domain, image: item.image};
        case "episodic-item": return {...empty, type: item.domain, record: item.record};
        case "episodic-line": return {...empty, type: item.domain, record: item.record, record_line_index: item.line_index, record_matched_text: item.matched_text}; 
    }

    return undefined!;
}

export function canonical_domain_of(item: Item): Domain {
    switch (item.domain) {
        case "image": return "image"
        case "sketch": return "sketch";
        case "episodic-item":
        case "episodic-line": return "episodic";
        case "subproject": return "subproject";
    }
}

export function item_to_page(item: Item): Page {
    switch (item.domain) {
        case "image": return {domain: "image", name: item.image.name};
        case "sketch": return {domain: "sketch", name: item.sketch.name};
        case "episodic-item": return {domain: "episodic", record_name: item.record.name ?? ""};
        case "episodic-line": return {domain: "episodic", record_name: item.record.name ?? "", line_index: item.line_index};
        case "subproject": return item;
    }
}

export function sort_items(items: Array<Item>) {
    return items.toSorted((a, b) => domains.indexOf(canonical_domain_of(a)) - domains.indexOf(canonical_domain_of(b)));
}

export function is_valid_domain(name?: string): name is Page["domain"] {
    if (!name) {
        return false;
    }

    const is_valid = domains.includes(name as Page["domain"]);
    return is_valid;
}

export function get_item_iteration(item: Item) {
    switch (item.domain) {
        case "image": return item.image.canon;
        case "episodic-item":
        case "episodic-line": return item.record.iteration;
    }
}

export function page_to_path(page: Page) {
    const item_suffix = (() => {
        switch (page.domain) {
            case "image": return page.name;
            case "sketch": return page.name;
            case "episodic": return `${page.record_name ?? ""}/${page.line_index ?? ""}`;
            case "home": return;
            case "subproject": return page.name;
        }
    })();

    const path = `/${page.domain}/${item_suffix ?? ""}`;
    return path;
}

export function path_to_page(path: string): Page {
    const path_parts = path.split("/").filter(part => part.length > 0);
    const domain = path_parts[0];

    const page = (() => {
        switch (domain) {
            case "image": return {domain, name: path_parts[1]};
            case "sketch": return {domain, name: path_parts[1]};
            case "episodic": return {domain, record_name: path_parts[1], line_id: path_parts[2]};
            case "home": return {domain};
            case "subproject": return {domain, name: path_parts[1]};
        }
    })();

    return page ?? {domain: "home"};
}
