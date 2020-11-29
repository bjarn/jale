import * as fs from 'fs'
import {Config} from '../models/config'
import delay from '../utils/delay'
import {getConfig, sheepdogHomeDir} from '../utils/sheepdog'
import {requireSudo} from '../utils/sudo'
import Service from './service'

class Dnsmasq extends Service {

    resolverPath = '/etc/resolver'
    configPath = '/usr/local/etc/dnsmasq.conf'
    exampleConfigPath = '/usr/local/opt/dnsmasq/dnsmasq.conf.example'

    customConfigPath = `${sheepdogHomeDir}/dnsmasq.conf`

    /**
     * Dnsmasq constructor
     * @param service
     * @param requireRoot
     */
    constructor(service: string = 'dnsmasq', requireRoot = true) {
        super(service, requireRoot)
    }

    configure = async (): Promise<boolean> => {
        let config: Config = await getConfig()

        try {
            await fs.copyFileSync(this.exampleConfigPath, this.configPath)
            await this.appendCustomConfig
            await this.setDomain(config.domain)

            return true
        } catch (e) {
            return false
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
            await fs.mkdirSync(this.resolverPath, {mode: 0o644})
            await fs.writeFileSync(`${this.resolverPath}/${domain}`, 'nameserver 127.0.0.1', {mode: 0o755})


            return true
        } catch (e) {
            return false
        }
    }

}

export default Dnsmasq