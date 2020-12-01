import * as fs from 'fs'
import fastcgiParams from '../templates/fastcgiParams'
import nginxConf from '../templates/nginx'
import nginxMailhogConf from '../templates/nginxMailhog'
import sheepdogNginxConf from '../templates/nginxSheepdog'
import {ensureDirectoryExists} from '../utils/filesystem'
import {getConfig, sheepdogLogsPath, sheepdogNginxAppsPath, sheepdogSitesPath} from '../utils/sheepdog'
import Nginx from './nginx'
import Service from './service'

class Mailhog extends Service {
    service = 'mailhog'

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    nginxConfigPath = `${sheepdogNginxAppsPath}/mailhog.conf`

    configure = async (): Promise<boolean> => {
        try {
            await this.addNginxConfiguration()
            await (new Nginx).restart()

            return true
        } catch (e) {
            throw e
        }
    }

    /**
     * Install the Mailhog Nginx configuration.
     */
    addNginxConfiguration = async (): Promise<void> => {
        const config = await getConfig()
        return fs.writeFileSync(this.nginxConfigPath, nginxMailhogConf(config.domain))
    }

}

export default Mailhog