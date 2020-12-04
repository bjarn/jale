"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const os = tslib_1.__importStar(require("os"));
const zPerformanceIni_1 = tslib_1.__importDefault(require("../templates/zPerformanceIni"));
const filesystem_1 = require("../utils/filesystem");
const os_1 = require("../utils/os");
const jale_1 = require("../utils/jale");
const service_1 = tslib_1.__importDefault(require("./service"));
class PhpFpm extends service_1.default {
    constructor() {
        super(...arguments);
        this.requireRoot = true;
        this.isEndOfLife = false;
        // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
        this.configRootPath = '/usr/local/etc/php';
        this.configure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.updateConfiguration();
            yield this.addPerformanceConfiguration();
            return true;
        });
        /**
         * Update Php's www.conf configuration.
         */
        this.updateConfiguration = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let config = yield fs.readFileSync(this.configPath, 'utf-8');
            config = config.replace(/^user = .+$/m, `user = ${os.userInfo().username}`);
            config = config.replace(/^group = .+$/m, 'group = staff'); // TODO: Make this dynamic. GIDs dont work.
            config = config.replace(/^listen = .+$/m, `listen = ${jale_1.jaleHomeDir}/jale.sock`);
            config = config.replace(/^;?listen\.owner = .+$/m, `listen.owner = ${os.userInfo().username}`);
            config = config.replace(/^;?listen\.group = .+$/m, 'listen.group = staff'); // TODO: Make this dynamic. GIDs dont work.
            config = config.replace(/^;?listen\.mode = .+$/m, 'listen.mode = 0777');
            config = config.replace(/^;?php_admin_value\[error_log\] = .+$/m, `php_admin_value[error_log] = ${jale_1.jaleLogsPath}/php.log`);
            return fs.writeFileSync(this.configPath, config);
        });
        /**
         * Create the z-performance.ini file which contains some optimized config settings.
         */
        this.addPerformanceConfiguration = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield filesystem_1.ensureDirectoryExists(this.iniDirectoryPath);
            const path = `${this.iniDirectoryPath}/z-performance.ini`;
            if (fs.existsSync(path)) {
                return;
            }
            return fs.writeFileSync(path, zPerformanceIni_1.default);
        });
        this.unLinkPhpVersion = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return os_1.client().serviceCtl.unlink(this.service);
        });
        this.linkPhpVersion = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return os_1.client().serviceCtl.link(this.service);
        });
    }
}
exports.default = PhpFpm;
//# sourceMappingURL=phpFpm.js.map