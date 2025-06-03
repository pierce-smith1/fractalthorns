const ADMIN_KEY_NAME = "admin_key";
const SUPPRESS_KEY_NAME = "suppress_admin_key";

export function get_stored_key(): string | null {
    if (window.localStorage.getItem(SUPPRESS_KEY_NAME)) {
        return null;
    }

    const key = window.localStorage.getItem(ADMIN_KEY_NAME);
    return key;
}