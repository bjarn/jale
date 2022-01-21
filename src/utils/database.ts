import fs from 'fs'
import OS from '../client/OS'
import Mariadb from '../services/mariadb'
import Mysql from '../services/mysql'
import Mysql57 from '../services/mysql57'
import Mysql80 from '../services/mysql80'

const supportedDatabases: string[] = [
    (new Mysql80).service,
    (new Mysql57).service,
    (new Mariadb).service
]

/**
 * Get the Database object by the name of the service.
 * @param databaseType
 */
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

/**
 * Get the currently linked Mysql binary.
 */
const getLinkedDatabase = async (): Promise<Mysql> => {
    const mysqlLink = await fs.lstatSync(`${OS.getInstance().usrLocalDir}/bin/mysql`)

    if (!mysqlLink.isSymbolicLink()) {
        throw Error('Mysql executable is not found.')
    }

    const mysqlBinary = await fs.realpathSync(`${OS.getInstance().usrLocalDir}/bin/mysql`)

    let linkedDatabase: Mysql | undefined

    supportedDatabases.forEach((versionName) => {
        if (mysqlBinary.includes(versionName)) {
            linkedDatabase = getDatabaseByName(versionName)
        }
    })

    if (linkedDatabase) {
        return linkedDatabase
    } else {
        throw Error('Unable to determine linked database')
    }
}

export {
    getDatabaseByName,
    getLinkedDatabase
}
