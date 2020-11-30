import execa from 'execa'
import * as fs from 'fs'
import {Config} from '../models/config'
import delay from '../utils/delay'
import {getConfig, sheepdogHomeDir} from '../utils/sheepdog'
import {requireSudo} from '../utils/sudo'
import Service from './service'

class Dnsmasq extends Service {
    service = 'dnsmasq'
    requireRoot = true

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
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
            await requireSudo()
            await execa('sudo', ['mkdir', '-p', this.resolverPath], {shell: true, stdio: 'inherit'})
            await execa('sudo', ['bash', '-c', `'echo "nameserver 127.0.0.1" > ${this.resolverPath}/${domain}'`], {
                shell: true,
                stdio: 'inherit'
            })

            return true
        } catch (e) {
            throw e
        }
    }

}

export default Dnsmasq