"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.ensureHomeDirExists = exports.sheepdogNginxAppsPath = exports.sheepdogFallbackServer = exports.sheepdogSitesPath = exports.sheepdogLogsPath = exports.sheepdogConfigPath = exports.sheepdogHomeDir = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const os_1 = require("os");
const filesystem_1 = require("./filesystem");
/**
 * Get the location of the home directory of Sheepdog.
 */
const sheepdogHomeDir = `${os_1.homedir()}/.sheepdog`;
exports.sheepdogHomeDir = sheepdogHomeDir;
/**
 * Get the location of the Sheepdog configuration.
 */
const sheepdogConfigPath = `${sheepdogHomeDir}/config.json`;
exports.sheepdogConfigPath = sheepdogConfigPath;
/**
 * Get the location of the Sheepdog log directory.
 */
const sheepdogLogsPath = `${sheepdogHomeDir}/log`;
exports.sheepdogLogsPath = sheepdogLogsPath;
/**
 * Get the location of the Sheepdog log directory.
 */
const sheepdogSitesPath = `${sheepdogHomeDir}/sites`;
exports.sheepdogSitesPath = sheepdogSitesPath;
/**
 * Get the location of the fallback server of Sheepdog.
 */
const sheepdogFallbackServer = `${sheepdogHomeDir}/server/index.php`;
exports.sheepdogFallbackServer = sheepdogFallbackServer;
/**
 * Get the location of the Nginx apps vhost directory.
 */
const sheepdogNginxAppsPath = `/usr/local/etc/nginx/sheepdog/apps`;
exports.sheepdogNginxAppsPath = sheepdogNginxAppsPath;
/**
 * Ensure the Sheepdog home directory exists. If it does not exist, we'll create it.
 *
 * Returns the current location of the sheepdog home directory.
 */
function ensureHomeDirExists() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return filesystem_1.ensureDirectoryExists(sheepdogHomeDir);
    });
}
exports.ensureHomeDirExists = ensureHomeDirExists;
function getConfig() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let rawConfig = yield fs.readFileSync(sheepdogConfigPath, 'utf-8');
        return JSON.parse(rawConfig);
    });
}
exports.getConfig = getConfig;
//# sourceMappingURL=sheepdog.js.map