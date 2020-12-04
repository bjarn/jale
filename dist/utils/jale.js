"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.ensureHomeDirExists = exports.jaleNginxAppTemplatesPath = exports.jaleNginxAppsPath = exports.jaleFallbackServer = exports.jaleSitesPath = exports.jaleLogsPath = exports.jaleConfigPath = exports.jaleHomeDir = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const os_1 = require("os");
const filesystem_1 = require("./filesystem");
/**
 * Get the location of the home directory of Jale.
 */
const jaleHomeDir = `${os_1.homedir()}/.jale`;
exports.jaleHomeDir = jaleHomeDir;
/**
 * Get the location of the Jale configuration.
 */
const jaleConfigPath = `${jaleHomeDir}/config.json`;
exports.jaleConfigPath = jaleConfigPath;
/**
 * Get the location of the Jale log directory.
 */
const jaleLogsPath = `${jaleHomeDir}/log`;
exports.jaleLogsPath = jaleLogsPath;
/**
 * Get the location of the Jale log directory.
 */
const jaleSitesPath = `${jaleHomeDir}/sites`;
exports.jaleSitesPath = jaleSitesPath;
/**
 * Get the location of the fallback server of Jale.
 */
const jaleFallbackServer = `${jaleHomeDir}/server/index.php`;
exports.jaleFallbackServer = jaleFallbackServer;
/**
 * Get the location of the Nginx apps vhost directory.
 */
const jaleNginxAppsPath = '/usr/local/etc/nginx/jale/apps';
exports.jaleNginxAppsPath = jaleNginxAppsPath;
/**
 * Get the location of the Nginx app templates vhost directory.
 */
const jaleNginxAppTemplatesPath = '/usr/local/etc/nginx/jale/templates';
exports.jaleNginxAppTemplatesPath = jaleNginxAppTemplatesPath;
/**
 * Ensure the Jale home directory exists. If it does not exist, we'll create it.
 *
 * Returns the current location of the Jale home directory.
 */
function ensureHomeDirExists() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return filesystem_1.ensureDirectoryExists(jaleHomeDir);
    });
}
exports.ensureHomeDirExists = ensureHomeDirExists;
function getConfig() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const rawConfig = yield fs.readFileSync(jaleConfigPath, 'utf-8');
        return JSON.parse(rawConfig);
    });
}
exports.getConfig = getConfig;
//# sourceMappingURL=jale.js.map