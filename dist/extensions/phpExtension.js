"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const fs = tslib_1.__importStar(require("fs"));
const pecl_1 = tslib_1.__importDefault(require("./pecl"));
class PhpExtension {
    constructor() {
        // Extension settings
        this.default = true;
        this.extensionType = PhpExtension.NORMAL_EXTENSION_TYPE;
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
                return;
            }
            const { stdout } = yield execa_1.default('pecl', ['install', this.extension]);
            const installRegex = new RegExp(`/Installing '(.*${this.alias}.so)'/`);
            // @ts-ignore
            if (installRegex.exec(stdout).length < 1)
                throw new Error(`Unable to find installation path for ${this.extension}. Result:\n\n${stdout}`);
            if (stdout.includes('Error:'))
                throw new Error(`Found installation path, but installation still failed: \n\n${stdout}`);
            const phpIniPath = yield pecl_1.default.getPhpIni();
            let phpIni = yield fs.readFileSync(phpIniPath, 'utf-8');
            const extensionRegex = new RegExp(`/(zend_extension|extension)="(.*${this.alias}.so)"/`);
            // @ts-ignore
            if (extensionRegex.exec(phpIni).length < 1)
                throw new Error(`Unable to find definition in ${phpIniPath} for ${this.extension}`);
            console.log(`Extension ${this.extension} has been installed.`);
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
            const regex = new RegExp(`/(zend_extension|extension)="(.*${this.alias}.so)"\/n/`);
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
            const regex = new RegExp(`/;?(zend_extension|extension)=".*${this.alias}.so"/`);
            phpIni = phpIni.replace(regex, '');
            yield fs.writeFileSync(phpIniPath, phpIni);
            console.log(`Extension ${this.extension} has been disabled`);
        });
    }
}
PhpExtension.NORMAL_EXTENSION_TYPE = 'extension';
PhpExtension.ZEND_EXTENSION_TYPE = 'zend_extension';
exports.default = PhpExtension;
//# sourceMappingURL=phpExtension.js.map