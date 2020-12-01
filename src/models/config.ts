interface Config {
    domain: string
    database: Database
    services: null // add enabled services to config.
}

interface Database {
    password: string
}

export {
    Config,
    Database
}