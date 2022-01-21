"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const OS_1 = tslib_1.__importDefault(require("../client/OS"));
const memcached_1 = tslib_1.__importDefault(require("../extensions/php/memcached"));
const memcache_1 = tslib_1.__importDefault(require("../services/memcache"));
const console_1 = require("../utils/console");
const phpFpm_1 = require("../utils/phpFpm");
class MemcacheController {
    constructor() {
        /**
         * Switch the service to the given version.
         */
        this.execute = (status) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (status !== 'on' && status !== 'off') {
                console_1.error('Invalid status. Please provide status \'on\' or \'off\'.');
                return false;
            }
            const memcache = new memcache_1.default();
            const phpMemcached = new memcached_1.default();
            let restart = false;
            if (status === 'on') {
                restart = yield this.enable(memcache, phpMemcached);
            }
            if (status === 'off') {
                restart = yield this.disable(memcache, phpMemcached);
            }
            if (restart) {
                const php = yield phpFpm_1.getLinkedPhpVersion();
                yield php.restart();
            }
            return true;
        });
        this.enable = (memcache, phpMemcached) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let restart = false;
            if (yield OS_1.default.getInstance().packageManager.packageIsInstalled(memcache.service)) {
                console_1.warning(`${memcache.service} is already installed.`);
            }
            else {
                restart = true;
                console_1.info(`Installing ${memcache.service}...`);
                yield memcache.install();
                console_1.success(`${memcache.service} has been installed.`);
            }
            console_1.info('Install Memcached PHP extension...');
            // Memcache is ready, now install the PHP extension.
            const phpExtensionInstalled = yield phpMemcached.install();
            return restart || phpExtensionInstalled;
        });
        this.disable = (memcache, phpMemcached) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const phpExtensionDisabled = yield phpMemcached.disable();
            if (phpExtensionDisabled) {
                console_1.success('Disabled memcache\'s PHP extension.');
            }
            else {
                console_1.warning('Memcache\'s PHP extension was not enabled.');
            }
            if (!(yield OS_1.default.getInstance().packageManager.packageIsInstalled(memcache.service))) {
                console_1.warning(`${memcache.service} was not installed.`);
                return phpExtensionDisabled;
            }
            console_1.info(`Uninstalling ${memcache.service}...`);
            yield memcache.uninstall();
            console_1.success(`${memcache.service} has been uninstalled.`);
            return true;
        });
    }
}
exports.default = MemcacheController;
//# sourceMappingURL=memcacheController.js.map