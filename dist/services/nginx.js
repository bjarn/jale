"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const OS_1 = tslib_1.__importDefault(require("../client/OS"));
const fastcgiParams_1 = tslib_1.__importDefault(require("../templates/fastcgiParams"));
const nginx_1 = tslib_1.__importDefault(require("../templates/nginx"));
const jale_1 = tslib_1.__importDefault(require("../templates/nginx/jale"));
const magento1_1 = tslib_1.__importDefault(require("../templates/nginx/magento1"));
const magento2_1 = tslib_1.__importDefault(require("../templates/nginx/magento2"));
const filesystem_1 = require("../utils/filesystem");
const jale_2 = require("../utils/jale");
const service_1 = tslib_1.__importDefault(require("./service"));
class Nginx extends service_1.default {
    constructor() {
        super(...arguments);
        this.service = 'nginx';
        this.requireRoot = true;
        this.configPath = `${OS_1.default.getInstance().usrLocalDir}/etc/nginx/nginx.conf`;
        this.jaleNginxFolderPath = `${OS_1.default.getInstance().usrLocalDir}/etc/nginx/jale`;
        this.jaleNginxConfigPath = `${this.jaleNginxFolderPath}/jale.conf`;
        this.fastCgiParamsConfigPath = `${OS_1.default.getInstance().usrLocalDir}/etc/nginx/fastcgi_params`;
        this.configure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield filesystem_1.ensureDirectoryExists(this.jaleNginxFolderPath);
            yield filesystem_1.ensureDirectoryExists(`${this.jaleNginxFolderPath}/apps`);
            yield filesystem_1.ensureDirectoryExists(jale_2.jaleNginxAppTemplatesPath);
            yield filesystem_1.ensureDirectoryExists(jale_2.jaleSitesPath);
            yield filesystem_1.ensureDirectoryExists(`${jale_2.jaleLogsPath}/nginx`);
            yield this.addConfiguration();
            yield this.addFallbackConfiguration();
            yield this.addFastCgiParams();
            yield this.addTemplates();
            return true;
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
            return fs.writeFileSync(this.jaleNginxConfigPath, jale_1.default);
        });
        /**
         * Install our custom fastcgi_params config for better performance.
         */
        this.addFastCgiParams = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return fs.writeFileSync(this.fastCgiParamsConfigPath, fastcgiParams_1.default);
        });
        /**
         * Install the customized Nginx app templates..
         */
        this.addTemplates = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            fs.writeFileSync(`${jale_2.jaleNginxAppTemplatesPath}/magento1.conf`, magento1_1.default);
            fs.writeFileSync(`${jale_2.jaleNginxAppTemplatesPath}/magento2.conf`, magento2_1.default);
        });
    }
}
exports.default = Nginx;
//# sourceMappingURL=nginx.js.map