"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDirectoryExists = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
/**
 * Ensure the given path exists, then return a string or false when failed.
 * @param path
 */
function ensureDirectoryExists(path) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!fs_1.existsSync(path)) {
            try {
                yield promises_1.mkdir(path, { mode: 0o755 });
                return path;
            }
            catch (e) {
                console.log(e.message);
                return false;
            }
        }
        return path;
    });
}
exports.ensureDirectoryExists = ensureDirectoryExists;
//# sourceMappingURL=filesystem.js.map