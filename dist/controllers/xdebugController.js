"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const xdebug_1 = tslib_1.__importDefault(require("../extensions/php/xdebug"));
const phpFpm_1 = require("../utils/phpFpm");
class XdebugController {
    constructor() {
        /**
         * Switch the service to the given version.
         */
        this.execute = (status) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (status !== 'on' && status !== 'off') {
                console.log(`Invalid status. Please provide status 'on' or 'off'.`);
                return false;
            }
            const xdebug = new xdebug_1.default();
            let restart = false;
            if (status === 'on') {
                restart = yield this.enable(xdebug);
            }
            if (status === 'off') {
                restart = yield this.disable(xdebug);
            }
            if (restart) {
                const php = yield phpFpm_1.getLinkedPhpVersion();
                yield php.restart();
            }
            return true;
        });
        this.enable = (xdebug) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield xdebug.isInstalled())) {
                console.log('Extension xdebug is not installed. Installing now...');
                yield xdebug.install();
            }
            // TODO: Enable auto start configuration for xdebug.
            console.log('Enabling xdebug...');
            yield xdebug.enable();
            return true;
        });
        this.disable = (xdebug) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield xdebug.isInstalled())) {
                console.log('Extension xdebug is not installed. We do not need to disable it then...');
                return false;
            }
            if (!(yield xdebug.isEnabled())) {
                console.log('Extension xdebug is not enabled.');
                return false;
            }
            yield xdebug.disable();
            return true;
        });
    }
}
exports.default = XdebugController;
//# sourceMappingURL=xdebugController.js.map