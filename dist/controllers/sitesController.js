"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_table_1 = tslib_1.__importDefault(require("cli-table"));
const fs_1 = require("fs");
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const laravel_1 = tslib_1.__importDefault(require("../templates/nginx/apps/laravel"));
const magento1_1 = tslib_1.__importDefault(require("../templates/nginx/apps/magento1"));
const magento2_1 = tslib_1.__importDefault(require("../templates/nginx/apps/magento2"));
const shopware6_1 = tslib_1.__importDefault(require("../templates/nginx/apps/shopware6"));
const console_1 = require("../utils/console");
const filesystem_1 = require("../utils/filesystem");
const jale_1 = require("../utils/jale");
const secureController_1 = tslib_1.__importDefault(require("./secureController"));
const kleur_1 = tslib_1.__importDefault(require("kleur"));
class SitesController {
    constructor() {
        this.appTypes = ['shopware6', 'laravel', 'magento2', 'magento1'];
        this.listLinks = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield jale_1.getConfig();
            yield filesystem_1.ensureDirectoryExists(jale_1.jaleSitesPath);
            const sites = fs_1.readdirSync(jale_1.jaleSitesPath).map(fileName => fileName.replace(`.${config.tld}.conf`, ''));
            if (sites.length) {
                console_1.info(`Currently there ${sites.length > 1 ? 'are' : 'is'} ${sites.length} active Nginx vhost ${sites.length > 1 ? 'configurations' : 'configuration'}\n`);
                const table = new cli_table_1.default({
                    head: ['Project', 'Secure'],
                    colors: false
                });
                for (const site of sites) {
                    const secure = new secureController_1.default(site).isSecure();
                    table.push([`${site}.${config.tld}`, (secure ? kleur_1.default.green('Yes') : kleur_1.default.red('No'))]);
                }
                console.log(table.toString());
            }
            else {
                console_1.info(`Currently there ${sites.length > 1 ? 'are' : 'is'} no active Nginx vhost ${sites.length > 1 ? 'configurations' : 'configuration'}`);
            }
        });
        this.executeLink = (type, name) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield jale_1.getConfig();
            let appType = config.defaultTemplate;
            if (type)
                appType = type;
            if (!this.appTypes.includes(appType)) {
                console_1.error(`Invalid app type ${appType}. Please select one of: ${this.appTypes.join(', ')}`);
                return;
            }
            const project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1);
            const domain = name || project;
            const hostname = `${domain}.${config.tld}`;
            console_1.info(`Linking ${project} to ${hostname}...`);
            yield filesystem_1.ensureDirectoryExists(jale_1.jaleSitesPath);
            this.createNginxConfig(appType, hostname, project);
            yield (new nginx_1.default()).reload();
            console_1.success(`Successfully linked ${domain}. Access it from ${console_1.url(`http://${hostname}`)}.`);
        });
        this.executeUnlink = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield jale_1.getConfig();
            const project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1);
            let filename = `${project}.${config.tld}.conf`;
            fs_1.readdirSync(jale_1.jaleSitesPath).forEach(file => {
                if (file.includes(project)) {
                    filename = file;
                }
            });
            if (!fs_1.existsSync(`${jale_1.jaleSitesPath}/${filename}`)) {
                console_1.error(`This project doesn't seem to be linked because the configuration file can't be found: ${jale_1.jaleSitesPath}/${filename}`);
                return;
            }
            console_1.info(`Unlinking ${project}...`);
            const secureController = new secureController_1.default;
            if (fs_1.existsSync(secureController.crtPath))
                yield secureController.executeUnsecure();
            fs_1.unlinkSync(`${jale_1.jaleSitesPath}/${filename}`);
            yield (new nginx_1.default()).reload();
            console_1.success(`Successfully unlinked ${project}.`);
        });
        /**
         * Create a Nginx template for the provided hostname with a specific template.
         *
         * @param appType
         * @param hostname
         * @param project
         */
        this.createNginxConfig = (appType, hostname, project) => {
            switch (appType) {
                case 'shopware6':
                    fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${project}.conf`, shopware6_1.default(hostname, process.cwd()));
                    break;
                case 'magento2':
                    fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${project}.conf`, magento2_1.default(hostname, process.cwd()));
                    break;
                case 'magento1':
                    fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${project}.conf`, magento1_1.default(hostname, process.cwd()));
                    break;
                default:
                    fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${project}.conf`, laravel_1.default(hostname, process.cwd()));
                    break;
            }
        };
    }
}
exports.default = SitesController;
//# sourceMappingURL=sitesController.js.map