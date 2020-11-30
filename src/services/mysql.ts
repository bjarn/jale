import execa from 'execa'
import {chmodSync, copyFileSync, existsSync, mkdirSync, unlinkSync, writeFileSync, writeSync} from 'fs'
import limitMaxFilesPlist from '../templates/limitMaxFilesPlist'
import myCnf from '../templates/myCnf'
import {client} from '../utils/os'
import Service from './service'

abstract class Mysql extends Service {
    requireRoot: boolean = false
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
            await this.removeConfiguration()
            // await this.setMaxFilesConfig() // TODO: Fix permission
            await this.linkDatabase()
            await this.installConfiguration()
            await this.setRootPassword()

            return true
        } catch (e) {
            throw e
        }
    }

    removeConfiguration = async (): Promise<void> => {
        if (existsSync(this.configPath))
            await unlinkSync(this.configPath)

        if (existsSync(`${this.configPath}.default`))
            await unlinkSync(`${this.configPath}.default`)
    }

    installConfiguration = async (): Promise<void> => {
        await chmodSync(this.mysqlDirectoryPath, 0o777)

        if (!existsSync(this.configRootPath)) {
            await mkdirSync(this.configRootPath)
        }

        let config = myCnf

        if (this.service === 'mariadb') {
            config = config.replace('show_compatibility_56=ON', '')
        }

        await writeFileSync(this.configPath, config)
    }

    setMaxFilesConfig = async (): Promise<void> => {
        await writeFileSync(this.maxFilesConfPath, limitMaxFilesPlist)
        await execa('launchctl', ['load', '-w', this.maxFilesConfPath])
    }

    linkDatabase = async (): Promise<void> => {
        await client().serviceCtl.link(this.service)
    }

    // TODO: We should get the current password from the Sheepdog config instead.
    setRootPassword = async (oldPassword: string = '', password: string = 'root'): Promise<boolean> => {
        try {
            await execa('mysqladmin', ['-u', 'root', `--password='${oldPassword}'`, 'password', password], {
                stdio: 'inherit'
            })
            return true
        } catch (e) {
            // Password probably is not equal to oldPassword so it failed.
            return false
        }
    }
}

export default Mysql