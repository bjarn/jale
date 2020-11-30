import * as fs from 'fs'
import * as os from 'os'
import zPerformanceIni from '../templates/zPerformanceIni'
import {ensureDirectoryExists} from '../utils/filesystem'
import {client} from '../utils/os'
import {sheepdogHomeDir, sheepdogLogsPath} from '../utils/sheepdog'
import Service from './service'

abstract class PhpFpm extends Service {
    requireRoot: boolean = true
    isEndOfLife: boolean = false

    formulaName: string = 'php@'
    static versionName: string = ''

    service: string = `${this.formulaName}${PhpFpm.versionName}`

    abstract configPath: string
    abstract iniDirectoryPath: string

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configRootPath = '/usr/local/etc/php'

    configure = async (): Promise<boolean> => {
        try {
            await this.updateConfiguration()
            await this.addPerformanceConfiguration()

            return true
        } catch (e) {
            throw e
        }
    }

    /**
     * Update Php's www.conf configuration.
     */
    updateConfiguration = async (): Promise<void> => {
        let config: string = await fs.readFileSync(this.configPath, 'utf-8')

        config = config.replace(/^user = .+$/m, `user = ${os.userInfo().username}`)
        config = config.replace(/^group = .+$/m, `group = ${os.userInfo().gid}`)
        config = config.replace(/^listen = .+$/m, `listen = ${sheepdogHomeDir}/sheepdog.sock`)
        config = config.replace(/^;?listen\.owner = .+$/m, `listen.owner = ${os.userInfo().username}`)
        config = config.replace(/^;?listen\.group = .+$/m, `listen.owner = ${os.userInfo().gid}`)
        config = config.replace(/^;?listen\.mode = .+$/m, `listen.mode = 0777`)
        config = config.replace(
            /^;?php_admin_value\[error_log\] = .+$/m,
            `php_admin_value[error_log] = ${sheepdogLogsPath}/php.log`
        )

        return fs.writeFileSync(this.configPath, config)
    }

    /**
     * Create the z-performance.ini file which contains some optimized config settings.
     */
    addPerformanceConfiguration = async (): Promise<void> => {
        await ensureDirectoryExists(this.iniDirectoryPath)

        let path = `${this.iniDirectoryPath}/z-performance.ini`

        if (fs.existsSync(path)) {
            return
        }

        return fs.writeFileSync(path, zPerformanceIni)
    }

    linkPhpVersion = async (): Promise<boolean> => {
        return client().serviceCtl.link(this.service)
    }
}

export default PhpFpm