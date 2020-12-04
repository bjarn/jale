import * as fs from 'fs'
import nginxMailhogConf from '../templates/nginxMailhog'
import {getConfig, jaleNginxAppsPath} from '../utils/jale'
import Nginx from './nginx'
import Service from './service'

class Mailhog extends Service {
    service = 'mailhog'

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    nginxConfigPath = `${jaleNginxAppsPath}/mailhog.conf`

    configure = async (): Promise<boolean> => {
        await this.addNginxConfiguration()
        await (new Nginx).restart()

        return true
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