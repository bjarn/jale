"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const fs_1 = require("fs");
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const openssl_1 = tslib_1.__importDefault(require("../templates/openssl"));
const console_1 = require("../utils/console");
const filesystem_1 = require("../utils/filesystem");
const jale_1 = require("../utils/jale");
const regex_1 = require("../utils/regex");
class SecureController {
    constructor(project) {
        this.executeSecure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console_1.info(`Securing ${this.hostname}...`);
            yield filesystem_1.ensureDirectoryExists(jale_1.jaleSslPath);
            yield this.unsecure();
            yield this.createSslCertificate();
            this.secureNginxConfig();
            yield (new nginx_1.default()).restart();
            console_1.success(`${this.hostname} has been secured and is now reachable via ${console_1.url(`https://${this.hostname}`)}.`);
        });
        this.executeUnsecure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.unsecure()) {
                console_1.success(`${this.hostname} has been unsecured and is no longer reachable over https.`);
                yield (new nginx_1.default()).restart();
            }
            console_1.warning(`The site ${this.hostname} is not secured.`);
            return;
        });
        this.isSecure = () => {
            return fs_1.existsSync(this.configPath);
        };
        /**
         * Unsecure the current hostname.
         */
        this.unsecure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fs_1.existsSync(this.crtPath)) {
                fs_1.unlinkSync(this.csrPath);
                fs_1.unlinkSync(this.keyPath);
                fs_1.unlinkSync(this.crtPath);
                fs_1.unlinkSync(this.configPath);
                yield execa_1.default('sudo', ['security', 'find-certificate', '-c', this.hostname, '-a', '-Z', '|', 'sudo', 'awk', '\'/SHA-1/{system("sudo security delete-certificate -Z "$NF)}\''], { shell: true, stdio: 'inherit' });
                this.unsecureNginxConfig();
                return true;
            }
            return false;
        });
        /**
         * Generate a certificate to secure a site.
         *
         * This will first generate an OpenSSL config which will be used for the CSR. Then we will create a private key and
         * generate a CSR. We will then request the certificate and trust it in our keychain.
         */
        this.createSslCertificate = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Write OpenSSL config for hostname
            yield fs_1.writeFileSync(this.configPath, openssl_1.default(this.hostname));
            // Generate private key
            yield execa_1.default('openssl', ['genrsa', '-out', this.keyPath, '2048']);
            // Generate certificate request with private key
            const subject = `/C=/ST=/O=/localityName=/commonName=*.${this.hostname}/organizationalUnitName=/emailAddress=/`;
            yield execa_1.default('openssl', ['req', '-new', '-key', this.keyPath, '-out', this.csrPath, '-subj',
                subject, '-config', this.configPath, '-passin', 'pass:']);
            yield execa_1.default('openssl', ['x509', '-req', '-days', '365', '-in', this.csrPath, '-signkey',
                this.keyPath, '-out', this.crtPath, '-extensions', 'v3_req', '-extfile', this.configPath]);
            // TODO: Make this cross-platform compatible.
            yield execa_1.default('sudo', ['security', 'add-trusted-cert', '-d', '-r', 'trustRoot', '-k', '/Library/Keychains/System.keychain', this.crtPath]);
        });
        /**
         * Make sure the Nginx config works with SSL.
         */
        this.secureNginxConfig = () => {
            let nginxConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, 'utf-8');
            if (nginxConfig.includes('listen 443 ssl http2')) {
                // TODO: Implement a nicer check. This is just a rushed thing to prevent duplicate ssl entries. Maybe it's
                // fine, but I ain't so sure about that.
                return;
            }
            nginxConfig = nginxConfig.replace('listen [::]:80;', `listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    ssl_certificate ${this.crtPath};
    ssl_certificate_key ${this.keyPath};\n`);
            fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, nginxConfig);
        };
        /**
         * Clean up the Nginx config by removing references to the key en cert and stop listening on port 443.
         */
        this.unsecureNginxConfig = () => {
            let nginxConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, 'utf-8');
            nginxConfig = nginxConfig.replace(`listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    ssl_certificate ${this.crtPath};
    ssl_certificate_key ${this.keyPath};\n`, 'listen [::]:80;');
            fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, nginxConfig);
        };
        this.config = jale_1.getConfig();
        this.project = project || process.cwd().substring(process.cwd().lastIndexOf('/') + 1);
        const vhostConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, 'utf-8');
        const serverNames = regex_1.serverNamesRegex.exec(vhostConfig);
        this.hostname = `${this.project}.${this.config.tld}`;
        // TODO catch this issue
        if (serverNames) {
            this.hostname = serverNames[0].split(' ')[1];
        }
        this.keyPath = `${jale_1.jaleSslPath}/${this.project}.key`;
        this.csrPath = `${jale_1.jaleSslPath}/${this.project}.csr`;
        this.crtPath = `${jale_1.jaleSslPath}/${this.project}.crt`;
        this.configPath = `${jale_1.jaleSslPath}/${this.project}.conf`;
    }
}
exports.default = SecureController;
//# sourceMappingURL=secureController.js.map