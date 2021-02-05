import {readFileSync, writeFileSync} from 'fs'
import {Config} from '../models/config'
import Nginx from '../services/nginx'
import {error, success, url} from '../utils/console'
import {getConfig, jaleSitesPath} from '../utils/jale'
import {serverNamesRegex} from '../utils/regex'

class SubdomainController {

    config: Config
    project: string
    hostname: string

    constructor() {
        this.config = getConfig()
        this.project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)

        const vhostConfig = readFileSync(`${jaleSitesPath}/${this.project}.conf`, 'utf-8')
        const serverNames = serverNamesRegex.exec(vhostConfig) ?? []

        serverNamesRegex.lastIndex = 0

        this.hostname = `${this.project}.${this.config.tld}`

        if (serverNames[0].split(' ').length > 1) {
            this.hostname = serverNames[0].split(' ')[1]
        }
    }

    execute = async (option: string, subdomain: string): Promise<void> => {
        if (option !== 'add' && option !== 'del') {
            error('Invalid option. Please use \'add\' or \'del\', followed by the subdomain.')
            return
        }

        let restartNginx = false

        if (option === 'add') {
            restartNginx = this.addSubdomain(subdomain)
        }
        else if (option === 'del') {
            restartNginx = this.deleteSubdomain(subdomain)
        }

        if (restartNginx)
            await (new Nginx()).reload()
    }

    /**
     * Check if the subdomain already exists in the vhost's Nginx configuration.
     *
     * @param subdomain
     */
    subdomainExists = (subdomain: string): boolean => {
        try {
            const vhostConfig = readFileSync(`${jaleSitesPath}/${this.project}.conf`, 'utf-8')
            return vhostConfig.includes(`${subdomain}.${this.hostname}`)
        } catch (e) {
            return false
        }
    }

    /**
     * Add a new subdomain to the vhost's Nginx configuration.
     *
     * @param subdomain
     */
    addSubdomain = (subdomain: string): boolean => {
        if (this.subdomainExists(subdomain)) {
            error(`Subdomain ${subdomain}.${this.hostname} already exists.`)
            return false
        }

        let vhostConfig = readFileSync(`${jaleSitesPath}/${this.project}.conf`, 'utf-8')
        const rawServerNames = serverNamesRegex.exec(vhostConfig)

        if (!rawServerNames) {
            return false // TODO: Catch this issue
        }

        const serverNames = rawServerNames[0].split(' ')
        serverNames.push(`${subdomain}.${this.hostname}`)

        // Replace the old server names with the server names including the new subdomain.
        vhostConfig = vhostConfig.replace(serverNamesRegex, serverNames.join(' '))

        writeFileSync(`${jaleSitesPath}/${this.project}.conf`, vhostConfig)

        success(`Added subdomain ${url(`${subdomain}.${this.hostname}`)}.`)

        return true
    }

    /**
     * Delete a subdomain from the vhost's Nginx configuration.
     *
     * @param subdomain
     */
    deleteSubdomain = (subdomain: string): boolean => {
        if (!this.subdomainExists(subdomain)) {
            error(`Subdomain ${url(`${subdomain}.${this.hostname}`)} does not exist.`)
            return false
        }

        let vhostConfig = readFileSync(`${jaleSitesPath}/${this.project}.conf`, 'utf-8')

        const rawServerNames = serverNamesRegex.exec(vhostConfig)

        if (!rawServerNames) {
            return false // TODO: Catch this issue
        }
        
        const serverNames = rawServerNames[0].split(' ')
        serverNames.splice(serverNames.indexOf(`${subdomain}.${this.hostname}`), 1)

        // Replace the old server names with the new list without the removed subdomain.
        vhostConfig = vhostConfig.replace(serverNamesRegex, serverNames.join(' '))

        writeFileSync(`${jaleSitesPath}/${this.project}.conf`, vhostConfig)

        success(`Removed subdomain ${subdomain}.${this.hostname}.`)

        return true
    }

}

export default SubdomainController