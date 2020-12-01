"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureHomeDirExists = exports.sheepdogHomeDir = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const os_1 = require("os");
/**
 * Return the location of the home directory of Sheepdog.
 */
function sheepdogHomeDir() {
    return `${os_1.homedir()}/.sheepdog`;
}
exports.sheepdogHomeDir = sheepdogHomeDir;
/**
 * Ensure the Sheepdog home directory exists. If it does not exist, we'll create it.
 *
 * Returns the current location of the sheepdog home directory.
 */
function ensureHomeDirExists() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!fs_1.existsSync(sheepdogHomeDir())) {
            try {
                yield promises_1.mkdir(sheepdogHomeDir(), { mode: 0o755 });
                return sheepdogHomeDir();
            }
            catch (e) {
                console.log(e.message);
                return false;
            }
        }
        return sheepdogHomeDir();
    });
}
exports.ensureHomeDirExists = ensureHomeDirExists;
//# sourceMappingURL=userUtils.js.map