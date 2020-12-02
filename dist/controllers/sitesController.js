"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const nginxSite_1 = tslib_1.__importDefault(require("../templates/nginxSite"));
const filesystem_1 = require("../utils/filesystem");
const jale_1 = require("../utils/jale");
class SitesController {
    constructor() {
        this.executeLink = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield jale_1.getConfig();
            const domain = process.cwd().substring(process.cwd().lastIndexOf('/') + 1);
            const hostname = `${domain}.${config.domain}`;
            yield filesystem_1.ensureDirectoryExists(jale_1.jaleSitesPath);
            yield fs_1.writeFileSync(`${jale_1.jaleSitesPath}/${hostname}.conf`, nginxSite_1.default(hostname, process.cwd()));
            yield (new nginx_1.default()).reload;
        });
    }
}
exports.default = SitesController;
//# sourceMappingURL=sitesController.js.map