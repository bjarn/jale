"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os_1 = require("../utils/os");
class Tool {
    constructor() {
        /**
         * Install the app.
         */
        this.install = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.isInstalled()) {
                console.log(`${this.name} already is installed`);
                return false;
            }
            console.log(`Installing ${this.name}...`);
            yield os_1.client().packageManager.install(this.alias, false);
            return true;
        });
        /**
         * Uninstall the app.
         */
        this.uninstall = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isInstalled())) {
                console.log(`${this.name} is not installed`);
            }
            console.log(`Uninstalling ${this.name}...`);
            yield os_1.client().packageManager.uninstall(this.alias, false);
            console.log(`Installed ${this.name}`);
            return true;
        });
        /**
         * Check if the is already installed..
         */
        this.isInstalled = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return os_1.client().packageManager.packageIsInstalled(this.alias);
        });
    }
}
exports.default = Tooll;
//# sourceMappingURL=tool.js.map