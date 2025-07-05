function get_or_die(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Unconfigured environment variable: ${key}`);
    }
    
    return value;
}

function get_or_default(key: string, _default: string) {
    const value = process.env[key];
    return value ?? _default;
}

const config = {
    self_url: get_or_die("RVA_SELF_URL"),
    content_root: get_or_default("RVA_CONTENT_ROOT", "./_content"),
    database_url: get_or_die("DATABASE_URL"),

    env: get_or_default("RVA_ENV", "prod"),
};

export default config;
