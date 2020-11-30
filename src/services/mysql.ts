import * as fs from 'fs'
import * as os from 'os'
import zPerformanceIni from '../templates/zPerformanceIni'
import {ensureDirectoryExists} from '../utils/filesystem'
import {client} from '../utils/os'
import {sheepdogHomeDir, sheepdogLogsPath} from '../utils/sheepdog'
import Service from './service'

abstract class Mysql extends Service {
    requireRoot: boolean = true
    isEndOfLife: boolean = false

    abstract versionName: string

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configRootPath = '/usr/local/etc'
    configPath = `${this.configRootPath}/my.cnf`
    maxFilesConfPath = '/Library/LaunchDaemons/limit.maxfiles.plist' // TODO: This is Mac only, make it cross platform.
    mysqlDirectoryPath = '/usr/local/var/mysql'

    rootPassword = 'root'

    systemDatabases = ['sys', 'performance_schema', 'information_schema']

    configure = async (): Promise<boolean> => {
        try {
            // await

            return true
        } catch (e) {
            throw e
        }
    }
}

export default Mysql