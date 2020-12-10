import {readFileSync, writeFileSync} from 'fs'
import Nginx from '../services/nginx'
import {getConfig, jaleSitesPath} from '../utils/jale'

class SubdomainController {

    serverNamesRegex = new RegExp('(?<=server_name \\s*).*?(?=\\s*;)', 'gi')

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
            restartNginx = this.deleteSubdomain(subdomain, hostname)
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
            return vhostConfig.includes(`${subdomain}.${hostname}`)
        } catch (e) {
            return false
        }
    }

    /**
     * Add a new subdomain to the vhost's Nginx configuration.
     *
     * @param subdomain
     * @param hostname
     */
    addSubdomain = (subdomain: string, hostname: string): boolean => {
        if (this.subdomainExists(subdomain, hostname)) {
            console.log(`Subdomain ${subdomain}.${hostname} already exists.`)
            return false
        }

        let vhostConfig = readFileSync(`${jaleSitesPath}/${hostname}.conf`, 'utf-8')
        const rawServerNames = this.serverNamesRegex.exec(vhostConfig)

        if (!rawServerNames) {
            return false // TODO: Catch this issue
        }

        const serverNames = rawServerNames[0].split(' ')
        serverNames.push(`${subdomain}.${hostname}`)

        // Replace the old server names with the server names including the new subdomain.
        vhostConfig = vhostConfig.replace(this.serverNamesRegex, serverNames.join(' '))

        writeFileSync(`${jaleSitesPath}/${hostname}.conf`, vhostConfig)

        console.log(`Added subdomain ${subdomain}.${hostname}`)

        return true
    }

    /**
     * Delete a subdomain from the vhost's Nginx configuration.
     *
     * @param subdomain
     * @param hostname
     */
    deleteSubdomain = (subdomain: string, hostname: string): boolean => {
        if (!this.subdomainExists(subdomain, hostname)) {
            console.log(`Subdomain ${subdomain}.${hostname} does not exist.`)
            return false
        }

        let vhostConfig = readFileSync(`${jaleSitesPath}/${hostname}.conf`, 'utf-8')

        const rawServerNames = this.serverNamesRegex.exec(vhostConfig)

        if (!rawServerNames) {
            return false // TODO: Catch this issue
        }
        
        const serverNames = rawServerNames[0].split(' ')
        serverNames.splice(serverNames.indexOf(`${subdomain}.${hostname}`), 1)

        // Replace the old server names with the new list without the removed subdomain.
        vhostConfig = vhostConfig.replace(this.serverNamesRegex, serverNames.join(' '))

        writeFileSync(`${jaleSitesPath}/${hostname}.conf`, vhostConfig)

        console.log(`Removed subdomain ${subdomain}.${hostname}`)

        return true
    }

}

export default SubdomainController