"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const nginxSite_1 = tslib_1.__importDefault(require("../templates/nginxSite"));
const filesystem_1 = require("../utils/filesystem");
const sheepdog_1 = require("../utils/sheepdog");
class SitesController {
    constructor() {
        this.executeLink = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield sheepdog_1.getConfig();
            const domain = process.cwd().substring(process.cwd().lastIndexOf('/') + 1);
            const hostname = `${domain}.${config.domain}`;
            yield filesystem_1.ensureDirectoryExists(sheepdog_1.sheepdogSitesPath);
            yield fs_1.writeFileSync(`${sheepdog_1.sheepdogSitesPath}/${hostname}.conf`, nginxSite_1.default(hostname, process.cwd()));
            yield (new nginx_1.default()).reload;
        });
    }
}
exports.default = SitesController;
//# sourceMappingURL=sitesController.js.map