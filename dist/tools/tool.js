"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const OS_1 = tslib_1.__importDefault(require("../client/OS"));
const console_1 = require("../utils/console");
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
            yield OS_1.default.getInstance().packageManager.install(this.alias, false);
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
            yield OS_1.default.getInstance().packageManager.uninstall(this.alias, false);
            console_1.success(`Uninstalled ${this.name}.`);
            return true;
        });
        /**
         * Check if app the is already installed..
         */
        this.isInstalled = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return OS_1.default.getInstance().packageManager.packageIsInstalled(this.alias);
        });
    }
}
exports.default = Tool;
//# sourceMappingURL=tool.js.map