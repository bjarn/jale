import execa from 'execa'
import {readFileSync, writeFileSync} from 'fs'
import {Config} from '../models/config'
import Nginx from '../services/nginx'
import nginx from '../templates/nginx'
import opensslConfig from '../templates/openssl'
import {ensureDirectoryExists} from '../utils/filesystem'
import {getConfig, jaleSitesPath, jaleSslPath} from '../utils/jale'

class SecureController {

    config: Config
    project: string
    hostname: string

    keyPath: string
    csrPath: string
    crtPath: string
    configPath: string

    constructor() {
        this.config = getConfig()
        this.project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)
        this.hostname = `${this.project}.${this.config.domain}`

        this.keyPath = `${jaleSslPath}/${this.hostname}.key`
        this.csrPath = `${jaleSslPath}/${this.hostname}.csr`
        this.crtPath = `${jaleSslPath}/${this.hostname}.crt`
        this.configPath = `${jaleSslPath}/${this.hostname}.conf`
    }

    executeSecure = async (): Promise<void> => {
        await ensureDirectoryExists(jaleSslPath)

        await this.createSslCertificate()
        this.secureNginxConfig()

        await (new Nginx()).restart()
    }

    executeUnsecure = async (): Promise<void> => {

        const restartNginx = false


        if (restartNginx)
            await (new Nginx()).reload()
    }

    /**
     * Generate a certificate to secure a site.
     *
     * This will first generate an OpenSSL config which will be used for the CSR. Then we will create a private key and
     * generate a CSR. We will then request the certificate and trust it in our keychain.
     */
    private createSslCertificate = async (): Promise<void> => {
        // Write OpenSSL config for hostname
        await writeFileSync(this.configPath, opensslConfig(this.hostname))

        // Generate private key
        await execa('openssl', ['genrsa', '-out', this.keyPath, '2048'])

        // Generate certificate request with private key
        const subject = `/C=/ST=/O=/localityName=/commonName=*.${this.hostname}/organizationalUnitName=/emailAddress=/`
        await execa('openssl', ['req', '-new', '-key', this.keyPath, '-out', this.csrPath, '-subj',
            subject, '-config', this.configPath, '-passin', 'pass:'])

        await execa('openssl', ['x509', '-req', '-days', '365', '-in', this.csrPath, '-signkey',
            this.keyPath, '-out', this.crtPath, '-extensions', 'v3_req', '-extfile', this.configPath])

        // TODO: Make this cross-platform compatible.
        await execa('sudo', ['security', 'add-trusted-cert', '-d', '-r', 'trustRoot', '-k', '/Library/Keychains/System.keychain', this.crtPath])
    }

    /**
     * Make sure the Nginx config works with SSL.
     */
    private secureNginxConfig = () => {
        let nginxConfig = readFileSync(`${jaleSitesPath}/${this.hostname}.conf`, 'utf-8')
        if (nginxConfig.includes('listen 443 ssl http2')) {
            // TODO: Implement a nicer check. This is just a rushed thing to prevent duplicate ssl entries. Maybe it's
            // fine, but I ain't so sure about that.
            return
        }

        nginxConfig = nginxConfig.replace('listen [::]:80;', `listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    ssl_certificate ${this.crtPath};
    ssl_certificate_key ${this.keyPath};\n`)

        writeFileSync(`${jaleSitesPath}/${this.hostname}.conf`, nginxConfig)
    }
}

export default SecureController