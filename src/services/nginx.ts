import * as fs from 'fs'
import fastcgiParams from '../templates/fastcgiParams'
import nginxConf from '../templates/nginx'
import sheepdogNginxConf from '../templates/nginxSheepdog'
import {ensureDirectoryExists} from '../utils/filesystem'
import {sheepdogLogsPath, sheepdogSitesPath} from '../utils/sheepdog'
import Service from './service'

class Nginx extends Service {
    service = 'nginx'
    requireRoot = true

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = '/usr/local/etc/nginx/nginx.conf'
    sheepdogNginxFolderPath = '/usr/local/etc/nginx/sheepdog'
    sheepdogNginxConfigPath = `${this.sheepdogNginxFolderPath}/sheepdog.conf`
    fastCgiParamsConfigPath = '/usr/local/etc/nginx/fastcgi_params'

    configure = async (): Promise<boolean> => {
        try {
            await ensureDirectoryExists(this.sheepdogNginxFolderPath)
            await ensureDirectoryExists(`${this.sheepdogNginxFolderPath}/apps`)
            await ensureDirectoryExists(sheepdogSitesPath)
            await ensureDirectoryExists(`${sheepdogLogsPath}/nginx`)
            await this.addConfiguration()
            await this.addFallbackConfiguration()
            await this.addFastCgiParams()

            return true
        } catch (e) {
            throw e
        }
    }

    /**
     * Install the customized Nginx configuration.
     */
    addConfiguration = async (): Promise<void> => {
        return fs.writeFileSync(this.configPath, nginxConf)
    }

    /**
     * Install the customized Nginx configuration.
     */
    addFallbackConfiguration = async (): Promise<void> => {
        return fs.writeFileSync(this.sheepdogNginxConfigPath, sheepdogNginxConf)
    }

    /**
     * Install our custom fastcgi_params config for better performance.
     */
    addFastCgiParams = async (): Promise<void> => {
        return fs.writeFileSync(this.fastCgiParamsConfigPath, fastcgiParams)
    }

}

export default Nginx