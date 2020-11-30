import Mariadb from '../services/mariadb'
import Mysql from '../services/mysql'
import Mysql57 from '../services/mysql57'
import Mysql80 from '../services/mysql80'

const getDatabaseByName = (databaseType: string): Mysql => {
    let database: Mysql

    switch (databaseType) {
        case (new Mysql80).service:
            database = new Mysql80()
            break
        case (new Mysql57).service:
            database = new Mysql57()
            break
        case (new Mariadb).service:
            database = new Mariadb()
            break
        default:
            throw Error('Invalid database type version: ' + databaseType)
    }

    return database
}

export {
    getDatabaseByName,
}