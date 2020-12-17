"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const packageManager_1 = tslib_1.__importDefault(require("../packageManager"));
class Homebrew extends packageManager_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'brew';
        this.name = 'Homebrew';
        this.path = '/usr/local/bin/brew';
    }
    /**
     * Install a package. In case of brew, the cask variable should be true of it ain't a formula but a cask.
     *
     * @param pkg
     * @param cask
     */
    install(pkg, cask = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let args = ['install', pkg];
            if (cask) {
                args = ['cask', 'install', pkg];
            }
            const { stdout } = yield execa_1.default('brew', args);
            return stdout.includes(pkg);
        });
    }
    /**
     * Uninstall a package. In case of brew, the cask variable should be true of it ain't a formula but a cask.
     *
     * @param pkg
     * @param cask
     */
    uninstall(pkg, cask = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let args = ['remove', pkg];
            if (cask) {
                args = ['cask', 'remove', pkg];
            }
            const { stdout } = yield execa_1.default('brew', args);
            return stdout.includes(pkg);
        });
    }
    /**
     * Check if the pkg is installed.
     *
     * @param pkg
     */
    packageIsInstalled(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { stdout } = yield execa_1.default('brew', ['list', '--formula']);
            return stdout.includes(pkg);
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    remove(pkg) {
        return Promise.resolve(false);
    }
    update() {
        return Promise.resolve(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    upgrade(pkg) {
        return Promise.resolve(false);
    }
}
exports.default = Homebrew;
//# sourceMappingURL=homebrew.js.map