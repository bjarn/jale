import {writeFileSync} from 'fs'
import Nginx from '../services/nginx'
import nginxLaravelTemplate from '../templates/nginx/apps/laravel'
import nginxMagento1Template from '../templates/nginx/apps/magento1'
import nginxMagento2Template from '../templates/nginx/apps/magento2'
import nginxMagento1Conf from '../templates/nginx/magento1'
import {ensureDirectoryExists} from '../utils/filesystem'
import {getConfig, jaleSitesPath} from '../utils/jale'

class SitesController {

    appTypes = ['laravel', 'magento2', 'magento1']

    executeLink = async (type: string | undefined): Promise<void> => {
        const config = await getConfig()
        let appType = config.defaultTemplate

        if (type)
            appType = type

        if (!this.appTypes.includes(appType)) {
            console.log(`Invalid app type ${appType}. Please select one of: ${this.appTypes.join(', ')}`)
            return
        }

        const domain = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)
        const hostname = `${domain}.${config.domain}`

        await ensureDirectoryExists(jaleSitesPath)

        this.createNginxConfig(appType, hostname)

        await (new Nginx()).reload()
    }

    /**
     * Create a Nginx template for the provided hostname with a specific template.
     *
     * @param appType
     * @param hostname
     */
    createNginxConfig = (appType: string, hostname: string): void => {
        switch (appType) {
        case 'magento2':
            writeFileSync(`${jaleSitesPath}/${hostname}.conf`, nginxMagento2Template(hostname, process.cwd()))
            break
        case 'magento1':
            writeFileSync(`${jaleSitesPath}/${hostname}.conf`, nginxMagento1Template(hostname, process.cwd()))
            break
        default:
            writeFileSync(`${jaleSitesPath}/${hostname}.conf`, nginxLaravelTemplate(hostname, process.cwd()))
            break
        }
    }


}

export default SitesController