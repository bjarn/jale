import * as fs from 'fs'
import fastcgiParams from '../templates/fastcgiParams'
import nginxConf from '../templates/nginx'
import jaleNginxConf from '../templates/nginx/jale'
import nginxMagento2Conf from '../templates/nginx/magento2'
import {ensureDirectoryExists} from '../utils/filesystem'
import {jaleLogsPath, jaleNginxAppTemplatesPath, jaleSitesPath} from '../utils/jale'
import Service from './service'

class Nginx extends Service {
    service = 'nginx'
    requireRoot = true

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = '/usr/local/etc/nginx/nginx.conf'
    jaleNginxFolderPath = '/usr/local/etc/nginx/jale'
    jaleNginxConfigPath = `${this.jaleNginxFolderPath}/jale.conf`
    fastCgiParamsConfigPath = '/usr/local/etc/nginx/fastcgi_params'

    configure = async (): Promise<boolean> => {
        await ensureDirectoryExists(this.jaleNginxFolderPath)
        await ensureDirectoryExists(`${this.jaleNginxFolderPath}/apps`)
        await ensureDirectoryExists(jaleNginxAppTemplatesPath)
        await ensureDirectoryExists(jaleSitesPath)
        await ensureDirectoryExists(`${jaleLogsPath}/nginx`)
        await this.addConfiguration()
        await this.addFallbackConfiguration()
        await this.addFastCgiParams()
        await this.addTemplates()

        return true
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
        return fs.writeFileSync(this.jaleNginxConfigPath, jaleNginxConf)
    }

    /**
     * Install our custom fastcgi_params config for better performance.
     */
    addFastCgiParams = async (): Promise<void> => {
        return fs.writeFileSync(this.fastCgiParamsConfigPath, fastcgiParams)
    }

    /**
     * Install the customized Nginx app templates..
     */
    addTemplates = async (): Promise<void> => {
        fs.writeFileSync(`${jaleNginxAppTemplatesPath}/magento2.conf`, nginxMagento2Conf)
    }

}

export default Nginx