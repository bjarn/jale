import execa from 'execa'
import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'fs'
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
        console.log(`Securing ${this.hostname}...`)
        await ensureDirectoryExists(jaleSslPath)

        await this.unsecure()

        await this.createSslCertificate()
        this.secureNginxConfig()

        await (new Nginx()).restart()

        console.log(`${this.hostname} has been secured and is now reachable via https://${this.hostname}`)
    }

    executeUnsecure = async (): Promise<void> => {
        if (await this.unsecure()) {
            console.log(`${this.hostname} has been unsecured and is no longer reachable over https`)
            await (new Nginx()).restart()
        } else {
            console.log(`The site ${this.hostname} is not secured.`)
            return
        }
    }

    /**
     * Unsecure the current hostname.
     */
    private unsecure = async (): Promise<boolean> => {
        if (existsSync(this.crtPath)) {
            unlinkSync(this.csrPath)
            unlinkSync(this.keyPath)
            unlinkSync(this.crtPath)
            unlinkSync(this.configPath)

            await execa(
                'sudo',
                ['security', 'find-certificate', '-c', this.hostname, '-a', '-Z', '|', 'sudo', 'awk', '\'/SHA-1/{system("sudo security delete-certificate -Z "$NF)}\''],
                {shell: true, stdio: 'inherit'}
            )

            this.unsecureNginxConfig()

            return true
        } else {
            return false
        }
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

    /**
     * Clean up the Nginx config by removing references to the key en cert and stop listening on port 443.
     */
    private unsecureNginxConfig = () => {
        let nginxConfig = readFileSync(`${jaleSitesPath}/${this.hostname}.conf`, 'utf-8')

        nginxConfig = nginxConfig.replace(`listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    ssl_certificate ${this.crtPath};
    ssl_certificate_key ${this.keyPath};\n`, 'listen [::]:80;')

        writeFileSync(`${jaleSitesPath}/${this.hostname}.conf`, nginxConfig)
    }
}

export default SecureController