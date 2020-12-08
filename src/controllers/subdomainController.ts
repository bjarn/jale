import {readFileSync, writeFileSync} from 'fs'
import Nginx from '../services/nginx'
import {getConfig, jaleSitesPath} from '../utils/jale'

class SubdomainController {

    appTypes = ['laravel', 'magento2', 'magento1']

    execute = async (option: string, subdomain: string): Promise<void> => {
        if (option !== 'add' && option !== 'del') {
            console.log('Invalid option. Please use \'add\' or \'del\', followed by the subdomain.')
            return
        }

        const config = await getConfig()
        const project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)
        const hostname = `${project}.${config.domain}`

        let restartNginx = false

        if (option === 'add') {
            restartNginx = this.addSubdomain(subdomain, hostname)
        }
        else if (option === 'del') {
            restartNginx = this.deleteSubdomain(subdomain, hostname, config.domain)
        }

        if (restartNginx)
            await (new Nginx()).reload()
    }

    /**
     * Check if the subdomain already exists in the vhost's Nginx configuration.
     *
     * @param subdomain
     * @param hostname
     */
    subdomainExists = (subdomain: string, hostname: string): boolean => {
        try {
            const vhostConfig = readFileSync(`${jaleSitesPath}/${hostname}.conf`, 'utf-8')
            return vhostConfig.includes(subdomain)
        } catch (e) {
            return false
        }
    }

    addSubdomain = async (subdomain: string, hostname: string): boolean => {
        if (this.subdomainExists(subdomain, hostname)) {
            console.log(`Subdomain ${subdomain}.${hostname} already exists.`)
            return false
        }

        const vhostConfig = readFileSync(`${jaleSitesPath}/${hostname}.conf`, 'utf-8')
        console.log(subdomain)

        return true
    }

    deleteSubdomain = (subdomain: string, hostname: string, extension: string): boolean => {
        // if (!this.subdomainExists(subdomain, hostname)) {
        //     console.log(`Subdomain ${subdomain}.${hostname} does not exist.`)
        //     return false
        // }

        let vhostConfig = readFileSync(`${jaleSitesPath}/${hostname}.conf`, 'utf-8')

        const serverNamesRegex = new RegExp('(?<=server_name \\s*).*?(?=\\s*;)', 'gi')
        const rawServerNames = serverNamesRegex.exec(vhostConfig)

        if (!rawServerNames) {
            return false // TODO: Catch this issue
        }
        
        const serverNames = rawServerNames[0].split(' ')
        serverNames.splice(serverNames.indexOf(`${subdomain}.${hostname}`), 1)

        // Replace the old server names with the server names including the new subdomain.
        vhostConfig = vhostConfig.replace(serverNamesRegex, serverNames.join(' '))

        writeFileSync(`${jaleSitesPath}/${hostname}.conf`, vhostConfig)

        console.log(`Removed subdomain ${subdomain}.${hostname}`)

        return true
    }

}

export default SubdomainController