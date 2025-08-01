function get_or_die(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Unconfigured environment variable: ${key}`);
    }
    
    return value;
}

function get_or_default(key: string, default_: string) {
    const value = process.env[key];
    return value ?? default_;
}

const config = {
    self_url: get_or_die("RVA_SELF_URL"),
    content_root: get_or_default("RVA_CONTENT_ROOT", "./_content"),
    database_url: get_or_die("DATABASE_URL"),

    splash_rate_limit_ms: get_or_default("RVA_SPLASH_RATE_LIMIT_MS", `${1000 * 60 * 60 * 24}`),
    splash_advance_interval_ms: get_or_default("RVA_SPLASH_ADVANCE_INTERVAL_MS", `${1000 * 60 * 60 * 24}`),

    env: get_or_default("RVA_ENV", "prod"),
};

export default config;
