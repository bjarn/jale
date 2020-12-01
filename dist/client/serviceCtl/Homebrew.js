"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const serviceCtl_1 = tslib_1.__importDefault(require("../serviceCtl"));
class Homebrew extends serviceCtl_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'brew';
        this.name = 'Homebrew';
        this.path = '/usr/local/bin/brew';
    }
    reload(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield execa_1.default('brew', ['services', 'reload', pkg]);
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    restart(pkg) {
        return Promise.resolve(false);
    }
    start(pkg) {
        return Promise.resolve(false);
    }
    stop(pkg) {
        return Promise.resolve(false);
    }
}
exports.default = Homebrewimport;
execa_1.default;
from;
'execa';
const packageManager_1 = tslib_1.__importDefault(require("../packageManager"));
class Homebrew extends packageManager_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'brew';
        this.name = 'Homebrew';
        this.path = '/usr/local/bin/brew';
    }
    install(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { stdout } = yield execa_1.default('brew', ['install', pkg]);
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
    remove(pkg) {
        return false;
    }
    update() {
        return false;
    }
    upgrade(pkg) {
        return false;
    }
}
exports.default = Homebrew;
//# sourceMappingURL=Homebrew.js.map