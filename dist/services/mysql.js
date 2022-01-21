"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const fs_1 = require("fs");
const OS_1 = tslib_1.__importDefault(require("../client/OS"));
const limitMaxFilesPlist_1 = tslib_1.__importDefault(require("../templates/limitMaxFilesPlist"));
const myCnf_1 = tslib_1.__importDefault(require("../templates/myCnf"));
const service_1 = tslib_1.__importDefault(require("./service"));
class Mysql extends service_1.default {
    constructor() {
        super(...arguments);
        this.requireRoot = false;
        this.isEndOfLife = false;
        this.configRootPath = `${OS_1.default.getInstance().usrLocalDir}/etc`;
        this.configPath = `${this.configRootPath}/my.cnf`;
        this.maxFilesConfPath = '/Library/LaunchDaemons/limit.maxfiles.plist'; // TODO: This is Mac only, make it cross platform.
        this.mysqlDirectoryPath = `${OS_1.default.getInstance().usrLocalDir}/var/mysql`;
        this.rootPassword = 'root';
        this.systemDatabases = ['sys', 'performance_schema', 'information_schema'];
        this.configure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.removeConfiguration();
            // await this.setMaxFilesConfig() // TODO: Fix permission
            yield this.linkDatabase();
            yield this.installConfiguration();
            yield this.setRootPassword();
            return true;
        });
        this.removeConfiguration = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fs_1.existsSync(this.configPath))
                yield fs_1.unlinkSync(this.configPath);
            if (fs_1.existsSync(`${this.configPath}.default`))
                yield fs_1.unlinkSync(`${this.configPath}.default`);
        });
        this.installConfiguration = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_1.chmodSync(this.mysqlDirectoryPath, 0o777);
            if (!fs_1.existsSync(this.configRootPath)) {
                yield fs_1.mkdirSync(this.configRootPath);
            }
            let config = myCnf_1.default;
            if (this.service === 'mariadb' || this.service === 'mysql@8.0') {
                config = config.replace('show_compatibility_56=ON', '');
            }
            if (this.service === 'mysql@8.0') {
                config = config.replace('query_cache_size=67108864', '');
                config = config.replace('query_cache_type=1', '');
                config = config.replace('query_cache_limit=4194304', '');
                config = config.replace('query_cache_size=67108864', '');
            }
            yield fs_1.writeFileSync(this.configPath, config);
        });
        this.setMaxFilesConfig = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_1.writeFileSync(this.maxFilesConfPath, limitMaxFilesPlist_1.default);
            yield execa_1.default('launchctl', ['load', '-w', this.maxFilesConfPath]);
        });
        this.linkDatabase = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield OS_1.default.getInstance().serviceCtl.link(this.service);
        });
        // TODO: We should get the current password from the Jale config instead.
        this.setRootPassword = (oldPassword = '', password = 'root') => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield execa_1.default('mysqladmin', ['-u', 'root', `--password='${oldPassword}'`, 'password', password], {
                    stdio: 'inherit'
                });
                return true;
            }
            catch (e) {
                // Password probably is not equal to oldPassword so it failed.
                return false;
            }
        });
    }
}
exports.default = Mysql;
//# sourceMappingURL=mysql.js.map