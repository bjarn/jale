"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const filesystem_1 = require("../utils/filesystem");
const jale_1 = require("../utils/jale");
class SubdomainController {
    constructor() {
        this.appTypes = ['laravel', 'magento2', 'magento1'];
        this.execute = (option, subdomain) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (option != 'add' || option != 'del') {
                console.log('Invalid option. Please use \'add\' or \'del\', followed by the subdomain.');
                return;
            }
            yield filesystem_1.ensureDirectoryExists(jale_1.jaleSitesPath);
            yield (new nginx_1.default()).reload();
        });
    }
}
exports.default = SubdomainController;
//# sourceMappingURL=subdomainController.js.map