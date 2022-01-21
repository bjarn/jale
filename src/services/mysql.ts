import execa from 'execa'
import {chmodSync, existsSync, mkdirSync, unlinkSync, writeFileSync} from 'fs'
import OS from '../client/OS'
import limitMaxFilesPlist from '../templates/limitMaxFilesPlist'
import myCnf from '../templates/myCnf'
import Service from './service'

abstract class Mysql extends Service {
    requireRoot = false
    isEndOfLife = false

    abstract versionName: string


    configRootPath = `${OS.getInstance().usrLocalDir}/etc`
    configPath = `${this.configRootPath}/my.cnf`
    maxFilesConfPath = '/Library/LaunchDaemons/limit.maxfiles.plist' // TODO: This is Mac only, make it cross platform.
    mysqlDirectoryPath = `${OS.getInstance().usrLocalDir}/var/mysql`

    rootPassword = 'root'

    systemDatabases = ['sys', 'performance_schema', 'information_schema']

    configure = async (): Promise<boolean> => {
        await this.removeConfiguration()
        // await this.setMaxFilesConfig() // TODO: Fix permission
        await this.linkDatabase()
        await this.installConfiguration()
        await this.setRootPassword()

        return true
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

        if (this.service === 'mariadb' || this.service === 'mysql@8.0') {
            config = config.replace('show_compatibility_56=ON', '')
        }

        if (this.service === 'mysql@8.0') {
            config = config.replace('query_cache_size=67108864', '')
            config = config.replace('query_cache_type=1', '')
            config = config.replace('query_cache_limit=4194304', '')
            config = config.replace('query_cache_size=67108864', '')
        }

        await writeFileSync(this.configPath, config)
    }

    setMaxFilesConfig = async (): Promise<void> => {
        await writeFileSync(this.maxFilesConfPath, limitMaxFilesPlist)
        await execa('launchctl', ['load', '-w', this.maxFilesConfPath])
    }

    linkDatabase = async (): Promise<void> => {
        await OS.getInstance().serviceCtl.link(this.service)
    }

    // TODO: We should get the current password from the Jale config instead.
    setRootPassword = async (oldPassword = '', password = 'root'): Promise<boolean> => {
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
