import execa from 'execa'
import * as fs from 'fs'
import {Config} from '../models/config'
import delay from '../utils/delay'
import {getConfig, sheepdogHomeDir} from '../utils/sheepdog'
import {requireSudo} from '../utils/sudo'
import Service from './service'

class Nginx extends Service {
    service = 'nginx'

    resolverPath = '/etc/resolver'
    configPath = '/usr/local/etc/dnsmasq.conf'

    customConfigPath = `${sheepdogHomeDir}/dnsmasq.conf`

    configure = async (): Promise<boolean> => {
        let config: Config = await getConfig()

        try {
            await this.appendCustomConfig
            await this.setDomain(config.domain)
            await this.addDomainResolver(config.domain)

            return true
        } catch (e) {
            throw e
        }
    }

    /**
     * Append our custom configuration file to the dnsmasq.conf.
     */
    appendCustomConfig = async (): Promise<void> => {
        return fs.appendFileSync(this.configPath, `\nconfig-file=${this.customConfigPath}\n`)
    }

    /**
     * Set our custom domain in our custom dnsmasq config file.
     * @param domain
     */
    setDomain = async (domain: string): Promise<void> => {
        return fs.appendFileSync(this.customConfigPath, `address=/.${domain}/127.0.0.1\n`)
    }

    /**
     * Create the Resolver config to resolve our custom domain.
     * @param domain
     */
    addDomainResolver = async (domain: string): Promise<boolean> => {
        try {
            await execa('sudo', ['mkdir', '-p', this.resolverPath])
            await execa('sudo', ['echo', 'nameserver 127.0.0.1', '>', `${this.resolverPath}/${domain}`])

            return true
        } catch (e) {
            throw e
        }
    }

}

export default Nginx