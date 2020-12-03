"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const fs = tslib_1.__importStar(require("fs"));
const extensions_1 = require("./extensions");
const pecl_1 = tslib_1.__importDefault(require("./pecl"));
class PhpExtension {
    constructor() {
        // Extension settings
        this.default = true;
        this.extensionType = extensions_1.NORMAL_EXTENSION_TYPE;
        /**
         * Check if the extension is enabled.
         */
        this.isEnabled = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { stdout } = yield execa_1.default('php', ['-m', '|', 'grep', this.extension]);
            const extensions = stdout.split('\n');
            return extensions.includes(this.extension);
        });
        /**
         * Check if the extension is installed.
         */
        this.isInstalled = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { stdout } = yield execa_1.default('pecl', ['list', '|', 'grep', this.extension]);
            return stdout.includes(this.extension);
        });
        /**
         * Install the extension.
         */
        this.install = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.isInstalled()) {
                console.log(`Extension ${this.extension} is already installed.`);
                return false;
            }
            const { stdout } = yield execa_1.default('pecl', ['install', this.extension]);
            const installRegex = new RegExp(`Installing '(.*${this.alias}.so)'`, 'g').test(stdout);
            if (!installRegex)
                throw new Error(`Unable to find installation path for ${this.extension}. Result:\n\n`);
            if (stdout.includes('Error:'))
                throw new Error(`Found installation path, but installation still failed: \n\n${stdout}`);
            const phpIniPath = yield pecl_1.default.getPhpIni();
            let phpIni = yield fs.readFileSync(phpIniPath, 'utf-8');
            // TODO: Fix duplicate extension entires in php.ini
            const extensionRegex = new RegExp(`(zend_extension|extension)="(.*${this.alias}.so)"`, 'g').test(phpIni);
            if (!extensionRegex)
                throw new Error(`Unable to find definition in ${phpIniPath} for ${this.extension}`);
            console.log(`Extension ${this.extension} has been installed.`);
            return true;
        });
        /**
         * Uninstall the extension.
         */
        this.uninstall = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield execa_1.default('pecl', ['uninstall', this.extension]);
        });
        /**
         * Enable the extension.
         */
        this.enable = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yield this.isEnabled()) {
                console.log(`Extension ${this.extension} is already enabled.`);
            }
            const phpIniPath = yield pecl_1.default.getPhpIni();
            let phpIni = yield fs.readFileSync(phpIniPath, 'utf-8');
            const regex = new RegExp(`(zend_extension|extension)="(.*${this.alias}.so)"\/n`, 'g');
            phpIni = phpIni.replace(regex, '');
            phpIni = `${this.extensionType}="${this.alias}.so"\n${phpIni}`;
            yield fs.writeFileSync(phpIniPath, phpIni);
            console.log(`Extension ${this.extension} has been enabled`);
        });
        /**
         * Disable the extension.
         */
        this.disable = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const phpIniPath = yield pecl_1.default.getPhpIni();
            let phpIni = yield fs.readFileSync(phpIniPath, 'utf-8');
            const regex = new RegExp(`;?(zend_extension|extension)=".*${this.alias}.so"\n`, 'g');
            phpIni = phpIni.replace(regex, '');
            yield fs.writeFileSync(phpIniPath, phpIni);
            console.log(`Extension ${this.extension} has been disabled`);
            return true;
        });
    }
}
exports.default = PhpExtension;
//# sourceMappingURL=phpExtension.js.map