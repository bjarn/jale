import * as fs from 'fs'
import * as os from 'os'
import OS from '../client/OS'
import zPerformanceIni from '../templates/zPerformanceIni'
import {ensureDirectoryExists} from '../utils/filesystem'
import {jaleHomeDir, jaleLogsPath} from '../utils/jale'
import Service from './service'

abstract class PhpFpm extends Service {
    requireRoot = true
    isEndOfLife = false

    abstract versionName: string

    abstract configPath: string
    abstract iniDirectoryPath: string

    configRootPath = `${OS.getInstance().usrLocalDir}/etc/php`

    configure = async (): Promise<boolean> => {
        await this.updateConfiguration()
        await this.addPerformanceConfiguration()

        return true
    }


    /**
     * Update Php's www.conf configuration.
     */
    updateConfiguration = async (): Promise<void> => {
        let config: string = await fs.readFileSync(this.configPath, 'utf-8')

        config = config.replace(/^user = .+$/m, `user = ${os.userInfo().username}`)
        config = config.replace(/^group = .+$/m, 'group = staff') // TODO: Make this dynamic. GIDs dont work.
        config = config.replace(/^listen = .+$/m, `listen = ${jaleHomeDir}/jale.sock`)
        config = config.replace(/^;?listen\.owner = .+$/m, `listen.owner = ${os.userInfo().username}`)
        config = config.replace(/^;?listen\.group = .+$/m, 'listen.group = staff') // TODO: Make this dynamic. GIDs dont work.
        config = config.replace(/^;?listen\.mode = .+$/m, 'listen.mode = 0777')
        config = config.replace(
            /^;?php_admin_value\[error_log\] = .+$/m,
            `php_admin_value[error_log] = ${jaleLogsPath}/php.log`
        )

        return fs.writeFileSync(this.configPath, config)
    }

    /**
     * Create the z-performance.ini file which contains some optimized config settings.
     */
    addPerformanceConfiguration = async (): Promise<void> => {
        await ensureDirectoryExists(this.iniDirectoryPath)

        const path = `${this.iniDirectoryPath}/z-performance.ini`

        if (fs.existsSync(path)) {
            return
        }

        return fs.writeFileSync(path, zPerformanceIni)
    }

    unLinkPhpVersion = async (): Promise<boolean> => {
        return OS.getInstance().serviceCtl.unlink(this.service)
    }

    linkPhpVersion = async (): Promise<boolean> => {
        return OS.getInstance().serviceCtl.link(this.service)
    }
}

export default PhpFpm
