"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const tool_1 = tslib_1.__importDefault(require("./tool"));
class Expose extends tool_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'expose';
        this.name = 'Beyondcode Expose';
        /**
         * Install the app.
         */
        this.install = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.isInstalled()) {
                console.log(`${this.name} already is installed. Execute it by running ${this.alias}`);
                return false;
            }
            console.log(`Installing ${this.name} using Composer...`);
            yield execa_1.default('composer', ['global', 'require', 'beyondcode/expose']);
            console.log(`Successfully installed ${this.name}`);
            return true;
        });
        /**
         * Uninstall the app.
         */
        this.uninstall = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isInstalled())) {
                console.log(`${this.name} is not installed`);
            }
            console.log(`Uninstalling ${this.name} using Composer...`);
            yield execa_1.default('composer', ['global', 'remove', 'beyondcode/expose']);
            console.log(`Successfully uninstalled ${this.name}`);
            return true;
        });
        /**
         * Check if the app is already installed..
         */
        this.isInstalled = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { stdout } = yield execa_1.default('composer', ['global', 'show', '-i']);
            return stdout.includes('beyondcode/expose');
        });
    }
}
exports.default = Expose;
//# sourceMappingURL=expose.js.map