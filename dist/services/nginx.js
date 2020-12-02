"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const fastcgiParams_1 = tslib_1.__importDefault(require("../templates/fastcgiParams"));
const nginx_1 = tslib_1.__importDefault(require("../templates/nginx"));
const nginxJale_1 = tslib_1.__importDefault(require("../templates/nginxJale"));
const filesystem_1 = require("../utils/filesystem");
const jale_1 = require("../utils/jale");
const service_1 = tslib_1.__importDefault(require("./service"));
class Nginx extends service_1.default {
    constructor() {
        super(...arguments);
        this.service = 'nginx';
        this.requireRoot = true;
        // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
        this.configPath = '/usr/local/etc/nginx/nginx.conf';
        this.jaleNginxFolderPath = '/usr/local/etc/nginx/jale';
        this.jaleNginxConfigPath = `${this.jaleNginxFolderPath}/jale.conf`;
        this.fastCgiParamsConfigPath = '/usr/local/etc/nginx/fastcgi_params';
        this.configure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield filesystem_1.ensureDirectoryExists(this.jaleNginxFolderPath);
                yield filesystem_1.ensureDirectoryExists(`${this.jaleNginxFolderPath}/apps`);
                yield filesystem_1.ensureDirectoryExists(jale_1.jaleSitesPath);
                yield filesystem_1.ensureDirectoryExists(`${jale_1.jaleLogsPath}/nginx`);
                yield this.addConfiguration();
                yield this.addFallbackConfiguration();
                yield this.addFastCgiParams();
                return true;
            }
            catch (e) {
                throw e;
            }
        });
        /**
         * Install the customized Nginx configuration.
         */
        this.addConfiguration = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return fs.writeFileSync(this.configPath, nginx_1.default);
        });
        /**
         * Install the customized Nginx configuration.
         */
        this.addFallbackConfiguration = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return fs.writeFileSync(this.jaleNginxConfigPath, nginxJale_1.default);
        });
        /**
         * Install our custom fastcgi_params config for better performance.
         */
        this.addFastCgiParams = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return fs.writeFileSync(this.fastCgiParamsConfigPath, fastcgiParams_1.default);
        });
    }
}
exports.default = Nginx;
//# sourceMappingURL=nginx.js.map