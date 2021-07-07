import Table from 'cli-table'
import {existsSync, readdirSync, unlinkSync, writeFileSync} from 'fs'
import Nginx from '../services/nginx'
import nginxShopware6Template from '../templates/nginx/apps/shopware6'
import nginxLaravelTemplate from '../templates/nginx/apps/laravel'
import nginxMagento1Template from '../templates/nginx/apps/magento1'
import nginxMagento2Template from '../templates/nginx/apps/magento2'
import {error, info, success, url} from '../utils/console'
import {ensureDirectoryExists} from '../utils/filesystem'
import {getConfig, jaleSitesPath} from '../utils/jale'
import SecureController from './secureController'
import kleur from 'kleur'

class SitesController {

    appTypes = ['shopware6', 'laravel', 'magento2', 'magento1']

    listLinks = async (): Promise<void> => {
        const config = await getConfig()
        await ensureDirectoryExists(jaleSitesPath)
        const sites = readdirSync(jaleSitesPath).map(fileName => fileName.replace(`.${config.tld}.conf`, ''))

        if (sites.length) {
            info(`Currently there ${sites.length > 1 ? 'are' : 'is'} ${sites.length} active Nginx vhost ${sites.length > 1 ? 'configurations' : 'configuration'}\n`)

            const table = new Table({
                head: ['Project', 'Secure'],
                colors: false
            })

            for (const site of sites) {
                const secure = new SecureController(site).isSecure()
                table.push([`${site}.${config.tld}`, (secure ? kleur.green('Yes') : kleur.red('No'))])
            }

            console.log(table.toString())
        } else {
            info(`Currently there ${sites.length > 1 ? 'are' : 'is'} no active Nginx vhost ${sites.length > 1 ? 'configurations' : 'configuration'}`)
        }
    }

    executeLink = async (type: string | undefined, name: string | undefined): Promise<void> => {
        const config = await getConfig()
        let appType = config.defaultTemplate

        if (type)
            appType = type

        if (!this.appTypes.includes(appType)) {
            error(`Invalid app type ${appType}. Please select one of: ${this.appTypes.join(', ')}`)
            return
        }

        const project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)
        const domain = name || project
        const hostname = `${domain}.${config.tld}`

        info(`Linking ${project} to ${hostname}...`)

        await ensureDirectoryExists(jaleSitesPath)

        this.createNginxConfig(appType, hostname, project)

        await (new Nginx()).reload()

        success(`Successfully linked ${domain}. Access it from ${url(`http://${hostname}`)}.`)
    }

    executeUnlink = async (): Promise<void> => {
        const config = await getConfig()

        const project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)

        let filename = `${project}.${config.tld}.conf`

        readdirSync(jaleSitesPath).forEach(file => {
            if (file.includes(project)) {
                filename = file
            }
        })

        if (!existsSync(`${jaleSitesPath}/${filename}`)) {
            error(`This project doesn't seem to be linked because the configuration file can't be found: ${jaleSitesPath}/${filename}`)
            return
        }

        info(`Unlinking ${project}...`)

        const secureController = new SecureController

        if (existsSync(secureController.crtPath))
            await secureController.executeUnsecure()

        unlinkSync(`${jaleSitesPath}/${filename}`)

        await (new Nginx()).reload()

        success(`Successfully unlinked ${project}.`)
    }

    /**
     * Create a Nginx template for the provided hostname with a specific template.
     *
     * @param appType
     * @param hostname
     * @param project
     */
    createNginxConfig = (appType: string, hostname: string, project: string): void => {
        switch (appType) {
        case 'shopware6':
            writeFileSync(`${jaleSitesPath}/${project}.conf`, nginxShopware6Template(hostname, process.cwd()))
            break
        case 'magento2':
            writeFileSync(`${jaleSitesPath}/${project}.conf`, nginxMagento2Template(hostname, process.cwd()))
            break
        case 'magento1':
            writeFileSync(`${jaleSitesPath}/${project}.conf`, nginxMagento1Template(hostname, process.cwd()))
            break
        default:
            writeFileSync(`${jaleSitesPath}/${project}.conf`, nginxLaravelTemplate(hostname, process.cwd()))
            break
        }
    }


}

export default SitesController