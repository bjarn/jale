"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const laravel_1 = tslib_1.__importDefault(require("../templates/nginx/apps/laravel"));
const magento2_1 = tslib_1.__importDefault(require("../templates/nginx/apps/magento2"));
const filesystem_1 = require("../utils/filesystem");
const jale_1 = require("../utils/jale");
class SitesController {
    constructor() {
        this.appTypes = ['laravel', 'magento2', 'magento1'];
        this.executeLink = (type) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield jale_1.getConfig();
            let appType = config.defaultTemplate;
            if (type)
                appType = type;
            if (!this.appTypes.includes(appType)) {
                console.log(`Invalid app type ${appType}. Please select one of: ${this.appTypes.join(', ')}`);
                return;
            }
            const domain = process.cwd().substring(process.cwd().lastIndexOf('/') + 1);
            const hostname = `${domain}.${config.domain}`;
            yield filesystem_1.ensureDirectoryExists(jale_1.jaleSitesPath);
            this.createNginxConfig(appType, hostname);
            yield (new nginx_1.default()).reload();
        });
        /**
         * Create a Nginx template for the provided hostname with a specific template.
         *
         * @param appType
         * @param hostname
         */
        this.createNginxConfig = (appType, hostname) => {
            switch (appType) {
                case 'magento2':
                    fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${hostname}.conf`, magento2_1.default(hostname, process.cwd()));
                    break;
                case 'magento1':
                    fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${hostname}.conf`, magento2_1.default(hostname, process.cwd()));
                    break;
                default:
                    fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${hostname}.conf`, laravel_1.default(hostname, process.cwd()));
                    break;
            }
        };
    }
}
exports.default = SitesController;
//# sourceMappingURL=sitesController.js.map