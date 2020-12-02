"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const fs_1 = require("fs");
const extensions_1 = require("./extensions");
class Pecl {
}
/**
 * Get the path of the PHP ini currently used by PECL.
 */
Pecl.getPhpIni = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const peclIni = yield execa_1.default('pecl', ['config-get', 'php_ini']);
    const peclIniPath = peclIni.stdout.replace('\n', '');
    if (fs_1.existsSync(peclIniPath))
        return peclIniPath;
    const phpIni = yield execa_1.default('php', ['-i', '|', 'grep', 'php.ini']);
    const matches = phpIni.stdout.match(/Path => ([^\s]*)/);
    if (!matches || matches.length <= 0)
        throw new Error('Unable to find php.ini.');
    return `${matches[1].trim()}/php.ini`;
});
/**
 * Get the path of the extension directory currently used by PECL.
 */
Pecl.getExtensionDirectory = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield execa_1.default('pecl', ['config-get', 'ext_dir']);
    let directory = stdout.replace('\n', '').trim();
    if (directory.indexOf('/Cellar/') !== -1)
        directory = directory.replace('/lib/php/', '/pecl/');
    return directory;
});
/**
 * Install all extensions supported by Jale. Set optionals to true to also include optional extensions.
 *
 * @param optionals
 */
Pecl.installExtensions = (optionals = false) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('Installing PECL extensions');
    for (const extension of extensions_1.PHP_EXTENSIONS) {
        const ext = new extension;
        if (!optionals && !ext.default)
            continue;
        yield ext.install();
        yield ext.enable();
    }
});
/**
 * Uninstall all extensions supported by Jale. Set optionals to true to also include optional extensions.
 *
 * @param optionals
 */
Pecl.uninstallExtensions = (optionals = false) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    console.log('Uninstalling PECL extensions');
    for (const extension of extensions_1.PHP_EXTENSIONS) {
        const ext = new extension;
        if (!optionals && !ext.default)
            continue;
        yield ext.uninstall();
        yield ext.disable();
    }
});
exports.default = Pecl;
//# sourceMappingURL=pecl.js.map