import {existsSync, readdirSync, unlinkSync, writeFileSync} from 'fs'
import Nginx from '../services/nginx'
import nginxLaravelTemplate from '../templates/nginx/apps/laravel'
import nginxMagento1Template from '../templates/nginx/apps/magento1'
import nginxMagento2Template from '../templates/nginx/apps/magento2'
import {error, info, success, url} from '../utils/console'
import {ensureDirectoryExists} from '../utils/filesystem'
import {getConfig, jaleSitesPath} from '../utils/jale'
import SecureController from './secureController'

class SitesController {

    appTypes = ['laravel', 'magento2', 'magento1']

    listLinks = async (): Promise<void> => {
        const config = await getConfig()
        await ensureDirectoryExists(jaleSitesPath)
        const sites = readdirSync(jaleSitesPath).map(fileName => fileName.replace('.conf', ''))

        if (sites.length) {
            info(`Currently there are ${sites.length} active Nginx vhost ${sites.length > 1 ? 'configurations' : 'configuration'}\n`)

            for (const site of sites) {
                info(`    - ${site}`)
            }
        } else {
            info(`Currently there are no active Nginx vhost ${sites.length > 1 ? 'configurations' : 'configuration'}`)
        }
    }

    executeLink = async (type: string | undefined): Promise<void> => {
        const config = await getConfig()
        let appType = config.defaultTemplate

        if (type)
            appType = type

        if (!this.appTypes.includes(appType)) {
            error(`Invalid app type ${appType}. Please select one of: ${this.appTypes.join(', ')}`)
            return
        }

        const domain = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)
        const hostname = `${domain}.${config.tld}`

        info(`Linking ${domain} to ${hostname}...`)

        await ensureDirectoryExists(jaleSitesPath)

        this.createNginxConfig(appType, hostname)

        await (new Nginx()).reload()

        success(`Successfully linked ${domain}. Access it from ${url(`http://${hostname}`)}.`)
    }

    executeUnlink = async (): Promise<void> => {
        const config = await getConfig()

        const domain = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)
        const hostname = `${domain}.${config.tld}`

        if (!existsSync(`${jaleSitesPath}/${hostname}.conf`)) {
            error(`This project doesn't seem to be linked because the configuration file can't be found: ${jaleSitesPath}/${hostname}.conf`)
            return
        }

        info(`Unlinking ${hostname}...`)

        const secureController = new SecureController

        if (existsSync(secureController.crtPath))
            await secureController.executeUnsecure()

        unlinkSync(`${jaleSitesPath}/${hostname}.conf`)

        await (new Nginx()).reload()

        success(`Successfully unlinked ${domain}.`)
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