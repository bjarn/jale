"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const console_1 = require("../utils/console");
const jale_1 = require("../utils/jale");
const regex_1 = require("../utils/regex");
class SubdomainController {
    constructor() {
        var _a;
        this.execute = (option, subdomain) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (option !== 'add' && option !== 'del') {
                console_1.error('Invalid option. Please use \'add\' or \'del\', followed by the subdomain.');
                return;
            }
            let restartNginx = false;
            if (option === 'add') {
                restartNginx = this.addSubdomain(subdomain);
            }
            else if (option === 'del') {
                restartNginx = this.deleteSubdomain(subdomain);
            }
            if (restartNginx)
                yield (new nginx_1.default()).reload();
        });
        /**
         * Check if the subdomain already exists in the vhost's Nginx configuration.
         *
         * @param subdomain
         */
        this.subdomainExists = (subdomain) => {
            try {
                const vhostConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, 'utf-8');
                return vhostConfig.includes(`${subdomain}.${this.hostname}`);
            }
            catch (e) {
                return false;
            }
        };
        /**
         * Add a new subdomain to the vhost's Nginx configuration.
         *
         * @param subdomain
         */
        this.addSubdomain = (subdomain) => {
            if (this.subdomainExists(subdomain)) {
                console_1.error(`Subdomain ${subdomain}.${this.hostname} already exists.`);
                return false;
            }
            let vhostConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, 'utf-8');
            const rawServerNames = regex_1.serverNamesRegex.exec(vhostConfig);
            if (!rawServerNames) {
                return false; // TODO: Catch this issue
            }
            const serverNames = rawServerNames[0].split(' ');
            serverNames.push(`${subdomain}.${this.hostname}`);
            // Replace the old server names with the server names including the new subdomain.
            vhostConfig = vhostConfig.replace(regex_1.serverNamesRegex, serverNames.join(' '));
            fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, vhostConfig);
            console_1.success(`Added subdomain ${console_1.url(`${subdomain}.${this.hostname}`)}.`);
            return true;
        };
        /**
         * Delete a subdomain from the vhost's Nginx configuration.
         *
         * @param subdomain
         */
        this.deleteSubdomain = (subdomain) => {
            if (!this.subdomainExists(subdomain)) {
                console_1.error(`Subdomain ${console_1.url(`${subdomain}.${this.hostname}`)} does not exist.`);
                return false;
            }
            let vhostConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, 'utf-8');
            const rawServerNames = regex_1.serverNamesRegex.exec(vhostConfig);
            if (!rawServerNames) {
                return false; // TODO: Catch this issue
            }
            const serverNames = rawServerNames[0].split(' ');
            serverNames.splice(serverNames.indexOf(`${subdomain}.${this.hostname}`), 1);
            // Replace the old server names with the new list without the removed subdomain.
            vhostConfig = vhostConfig.replace(regex_1.serverNamesRegex, serverNames.join(' '));
            fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, vhostConfig);
            console_1.success(`Removed subdomain ${subdomain}.${this.hostname}.`);
            return true;
        };
        this.config = jale_1.getConfig();
        this.project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1);
        const vhostConfig = fs_1.readFileSync(`${jale_1.jaleSitesPath}/${this.project}.conf`, 'utf-8');
        const serverNames = (_a = regex_1.serverNamesRegex.exec(vhostConfig)) !== null && _a !== void 0 ? _a : [];
        regex_1.serverNamesRegex.lastIndex = 0;
        this.hostname = `${this.project}.${this.config.tld}`;
        if (serverNames[0].split(' ').length > 1) {
            this.hostname = serverNames[0].split(' ')[1];
        }
    }
}
exports.default = SubdomainController;
//# sourceMappingURL=subdomainController.js.map