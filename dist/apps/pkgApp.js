"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const fs = tslib_1.__importStar(require("fs"));
const fs_1 = require("fs");
const http = tslib_1.__importStar(require("http"));
class App {
    constructor() {
        this.binLocation = '/usr/local/bin';
        /**
         * Install the binary.
         */
        this.install = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fileName = this.url.substring(this.url.lastIndexOf('/') + 1);
            const file = fs.createWriteStream(`/tmp/${fileName}`);
            console.log(`Downloading binary for ${this.name}...`);
            const res = yield http.get(this.url);
            yield res.pipe(file);
            if (!(yield this.isValidShasum(`/tmp/${fileName}`))) {
                console.log(`Unable to install ${this.name}. The checksum ${this.shasum} is not equal to the one of the downloaded file.`);
                yield fs_1.unlinkSync(`/tmp/${fileName}`);
                return false;
            }
            yield fs.copyFileSync(`/tmp/${fileName}`, `${this.binLocation}/${this.alias}`);
            yield fs_1.chmodSync(`${this.binLocation}/${this.alias}`, 0o777);
            console.log(`Successfully installed ${this.name}`);
            return true;
        });
        /**
         * Uninstall the binary
         */
        this.uninstall = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isInstalled())) {
                console.log(`${this.name} is not installed`);
            }
            console.log(`Uninstalling ${this.name}...`);
            try {
                yield fs_1.unlinkSync(`${this.binLocation}/${this.alias}`);
            }
            catch (e) {
                throw new Error(`Unable to uninstall ${this.name}. Please remove the file manually to continue:\nrm${this.binLocation}/${this.alias}`);
            }
            console.log(`Uninstalled ${this.name}`);
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
exports.default = App;
//# sourceMappingURL=pkgApp.js.map