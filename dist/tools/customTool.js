"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const fs = tslib_1.__importStar(require("fs"));
const fs_1 = require("fs");
const OS_1 = tslib_1.__importDefault(require("../client/OS"));
const console_1 = require("../utils/console");
const tool_1 = tslib_1.__importDefault(require("./tool"));
class CustomTool extends tool_1.default {
    constructor() {
        super(...arguments);
        this.binLocation = `${OS_1.default.getInstance().usrLocalDir}/bin`;
        /**
         * Install the binary.
         */
        this.install = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.isInstalled()) {
                console_1.error(`${this.name} already is installed. Execute it by running ${this.alias}`);
                return false;
            }
            const fileName = this.url.substring(this.url.lastIndexOf('/') + 1);
            console_1.info(`Downloading binary for ${this.name}...`);
            yield execa_1.default('curl', ['-OL', this.url], { cwd: '/tmp/' });
            if (!(yield this.isValidShasum(`/tmp/${fileName}`))) {
                console_1.error(`Unable to install ${this.name}. The checksum ${this.shasum} is not equal to the one of the downloaded file.`);
                yield fs_1.unlinkSync(`/tmp/${fileName}`);
                return false;
            }
            yield fs.copyFileSync(`/tmp/${fileName}`, `${this.binLocation}/${this.alias}`);
            yield fs_1.chmodSync(`${this.binLocation}/${this.alias}`, 0o777);
            console_1.success(`Successfully installed ${this.name}.`);
            return true;
        });
        /**
         * Uninstall the binary
         */
        this.uninstall = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isInstalled())) {
                console_1.error(`${this.name} is not installed`);
                return false;
            }
            console_1.info(`Uninstalling ${this.name}...`);
            try {
                yield fs_1.unlinkSync(`${this.binLocation}/${this.alias}`);
            }
            catch (e) {
                throw new Error(`Unable to uninstall ${this.name}. Please remove the file manually to continue:\nrm${this.binLocation}/${this.alias}`);
            }
            console_1.success(`Uninstalled ${this.name}.`);
            return true;
        });
        /**
         * Check if the binary of the app exists.
         */
        this.isInstalled = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return fs_1.existsSync(`${this.binLocation}/${this.alias}`);
        });
        /**
         * Check if the file has a valid shasum.
         *
         * @param path
         */
        this.isValidShasum = (path) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { stdout } = yield execa_1.default('shasum', ['-a256', path]);
            const shasum = stdout.replace(path, '').trim();
            return shasum === this.shasum;
        });
    }
}
exports.default = CustomTool;
//# sourceMappingURL=customTool.js.map