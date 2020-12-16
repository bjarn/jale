"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const jale_1 = require("../utils/jale");
class SubdomainController {
    constructor() {
        this.serverNamesRegex = new RegExp('(?<=server_name \\s*).*?(?=\\s*;)', 'gi');
        this.execute = (option, subdomain) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (option !== 'add' && option !== 'del') {
                console.log('Invalid option. Please use \'add\' or \'del\', followed by the subdomain.');
                return;
            }
            const config = yield jale_1.getConfig();
            const project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1);
            const hostname = `${project}.${config.tld}`;
            let restartNginx = false;
            if (option === 'add') {
                restartNginx = this.addSubdomain(subdomain, hostname);
            }
            else if (option === 'del') {
                restartNginx = this.deleteSubdomain(subdomain, hostname);
            }
            if (restartNginx)
                yield (new nginx_1.default()).reload();
        });
        /**
         * Check if the subdomain already exists in the vhost's Nginx configuration.
         *
         * @param subdomain
         * @param hostname
         */
        this.subdomainExists = (subdomain, hostname) => {
            try {
                const vhostConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${hostname}.conf`, 'utf-8');
                return vhostConfig.includes(`${subdomain}.${hostname}`);
            }
            catch (e) {
                return false;
            }
        };
        /**
         * Add a new subdomain to the vhost's Nginx configuration.
         *
         * @param subdomain
         * @param hostname
         */
        this.addSubdomain = (subdomain, hostname) => {
            if (this.subdomainExists(subdomain, hostname)) {
                console.log(`Subdomain ${subdomain}.${hostname} already exists.`);
                return false;
            }
            let vhostConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${hostname}.conf`, 'utf-8');
            const rawServerNames = this.serverNamesRegex.exec(vhostConfig);
            if (!rawServerNames) {
                return false; // TODO: Catch this issue
            }
            const serverNames = rawServerNames[0].split(' ');
            serverNames.push(`${subdomain}.${hostname}`);
            // Replace the old server names with the server names including the new subdomain.
            vhostConfig = vhostConfig.replace(this.serverNamesRegex, serverNames.join(' '));
            fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${hostname}.conf`, vhostConfig);
            console.log(`Added subdomain ${subdomain}.${hostname}`);
            return true;
        };
        /**
         * Delete a subdomain from the vhost's Nginx configuration.
         *
         * @param subdomain
         * @param hostname
         */
        this.deleteSubdomain = (subdomain, hostname) => {
            if (!this.subdomainExists(subdomain, hostname)) {
                console.log(`Subdomain ${subdomain}.${hostname} does not exist.`);
                return false;
            }
            let vhostConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${hostname}.conf`, 'utf-8');
            const rawServerNames = this.serverNamesRegex.exec(vhostConfig);
            if (!rawServerNames) {
                return false; // TODO: Catch this issue
            }
            const serverNames = rawServerNames[0].split(' ');
            serverNames.splice(serverNames.indexOf(`${subdomain}.${hostname}`), 1);
            // Replace the old server names with the new list without the removed subdomain.
            vhostConfig = vhostConfig.replace(this.serverNamesRegex, serverNames.join(' '));
            fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${hostname}.conf`, vhostConfig);
            console.log(`Removed subdomain ${subdomain}.${hostname}`);
            return true;
        };
    }
}
exports.default = SubdomainController;
//# sourceMappingURL=subdomainController.js.map