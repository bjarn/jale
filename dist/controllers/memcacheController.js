"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const memcached_1 = tslib_1.__importDefault(require("../extensions/php/memcached"));
const memcache_1 = tslib_1.__importDefault(require("../services/memcache"));
const os_1 = require("../utils/os");
const phpFpm_1 = require("../utils/phpFpm");
class MemcacheController {
    constructor() {
        /**
         * Switch the service to the given version.
         */
        this.execute = (status) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (status !== 'on' && status !== 'off') {
                console.log(`Invalid status. Please provide status 'on' or 'off'.`);
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
            if (yield os_1.client().packageManager.packageIsInstalled(memcache.service)) {
                console.log(`${memcache.service} is already installed.`);
            }
            else {
                restart = true;
                console.log(`Installing ${memcache.service}...`);
                yield memcache.install();
                console.log(`${memcache.service} has been installed`);
            }
            // Memcache is ready, now install the PHP extension.
            const phpExtensionInstalled = yield phpMemcached.install();
            return restart || phpExtensionInstalled;
        });
        this.disable = (memcache, phpMemcached) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const phpExtensionDisabled = yield phpMemcached.disable();
            if (phpExtensionDisabled) {
                console.log(`Disabled memcache's PHP extension`);
            }
            else {
                console.log(`Memcache's PHP extension was not enabled.`);
            }
            if (!(yield os_1.client().packageManager.packageIsInstalled(memcache.service))) {
                console.log(`${memcache.service} was not installed.`);
                return phpExtensionDisabled;
            }
            console.log(`Uninstalling ${memcache.service}...`);
            yield memcache.uninstall();
            console.log(`${memcache.service} has been uninstalled`);
            return true;
        });
    }
}
exports.default = MemcacheController;
//# sourceMappingURL=memcacheController.js.map