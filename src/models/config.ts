interface Config {
    tld: string
    defaultTemplate: string
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