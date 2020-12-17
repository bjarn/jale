import execa from 'execa'
import * as fs from 'fs'
import {Config} from '../models/config'
import {getConfig, jaleHomeDir} from '../utils/jale'
import {requireSudo} from '../utils/sudo'
import Service from './service'

class Dnsmasq extends Service {
    service = 'dnsmasq'
    requireRoot = true

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    resolverPath = '/etc/resolver'
    configPath = '/usr/local/etc/dnsmasq.conf'

    customConfigPath = `${jaleHomeDir}/dnsmasq.conf`

    configure = async (): Promise<boolean> => {
        const config: Config = await getConfig()

        this.appendCustomConfig()
        this.setDomain(config.tld)
        await this.addDomainResolver(config.tld)

        return true
    }

    /**
     * Append our custom configuration file to the dnsmasq.conf.
     */
    appendCustomConfig = (): void => {
        const config = fs.readFileSync(this.configPath, 'utf-8')

        if (!config.includes(this.customConfigPath))
            fs.appendFileSync(this.configPath, `\nconfig-file=${this.customConfigPath}\n`)
    }

    /**
     * Set our custom tld in our custom dnsmasq config file.
     * @param tld
     */
    setDomain = (tld: string): void => {
        return fs.writeFileSync(this.customConfigPath, `address=/.${tld}/127.0.0.1\n`)
    }

    /**
     * Create the Resolver config to resolve our custom domain.
     * @param tld
     */
    addDomainResolver = async (tld: string): Promise<boolean> => {
        // TODO: Should improve this part, we're executing plain commands in order to bypass issues with root permissions.
        await requireSudo()
        await execa('sudo', ['mkdir', '-p', this.resolverPath], {shell: true, stdio: 'inherit'})
        await execa('sudo', ['bash', '-c', `'echo "nameserver 127.0.0.1" > ${this.resolverPath}/${tld}'`], {
            shell: true,
            stdio: 'inherit'
        })

        return true
    }

}

export default Dnsmasq