function get_or_die(key: string): string {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Unconfigured environment variable: ${key}`);
    }
    
    return value;
}

const config = {
    self_url: get_or_die("RVA_SELF_URL"),
    content_root: process.env.RVA_CONTENT_ROOT ?? "./_content",
    database_file: get_or_die("RVA_DATABASE_FILE"),

    env: process.env.RVA_ENV ?? "prod",
};

export default config;