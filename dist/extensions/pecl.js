"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const console_1 = require("../utils/console");
const apcu_1 = tslib_1.__importDefault(require("./php/apcu"));
const geoip_1 = tslib_1.__importDefault(require("./php/geoip"));
const memcached_1 = tslib_1.__importDefault(require("./php/memcached"));
const xdebug_1 = tslib_1.__importDefault(require("./php/xdebug"));
const yaml_1 = tslib_1.__importDefault(require("./php/yaml"));
class Pecl {
}
/**
 * All extensions available in Jale.
 */
Pecl.PHP_EXTENSIONS = [
    apcu_1.default,
    geoip_1.default,
    memcached_1.default,
    xdebug_1.default,
    yaml_1.default
];
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
    console_1.info('Installing PECL extensions...');
    for (const extension of Pecl.PHP_EXTENSIONS) {
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
    console_1.info('Uninstalling PECL extensions...');
    for (const extension of Pecl.PHP_EXTENSIONS) {
        const ext = new extension;
        if (!optionals && !ext.default)
            continue;
        yield ext.uninstall();
        yield ext.disable();
    }
});
exports.default = Pecl;
//# sourceMappingURL=pecl.js.map