"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const console_1 = require("../utils/console");
const os_1 = require("../utils/os");
class Tool {
    constructor() {
        /**
         * Install the app.
         */
        this.install = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.isInstalled()) {
                console_1.error(`${this.name} already is installed.`);
                return false;
            }
            console_1.info(`Installing ${this.name}...`);
            yield os_1.client().packageManager.install(this.alias, false);
            return true;
        });
        /**
         * Uninstall the app.
         */
        this.uninstall = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isInstalled())) {
                console_1.error(`${this.name} is not installed.`);
                return false;
            }
            console_1.info(`Uninstalling ${this.name}...`);
            yield os_1.client().packageManager.uninstall(this.alias, false);
            console_1.success(`Uninstalled ${this.name}.`);
            return true;
        });
        /**
         * Check if app the is already installed..
         */
        this.isInstalled = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return os_1.client().packageManager.packageIsInstalled(this.alias);
        });
    }
}
exports.default = Tool;
//# sourceMappingURL=tool.js.map