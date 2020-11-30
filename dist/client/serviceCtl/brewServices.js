"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
const serviceCtl_1 = tslib_1.__importDefault(require("../serviceCtl"));
class BrewServices extends serviceCtl_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'brew';
        this.name = 'Homebrew';
        this.path = '/usr/local/bin/brew';
    }
    reload(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield execa_1.default('brew', ['services', 'reload', pkg], { shell: true });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    restart(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.stop(pkg);
                yield this.start(pkg);
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    start(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield execa_1.default('brew', ['services', 'start', pkg], { shell: true });
                return true;
            }
            catch (e) {
                throw e;
            }
        });
    }
    stop(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield execa_1.default('brew', ['services', 'stop', pkg], { shell: true });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    restartAsRoot(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.stopAsRoot(pkg);
                yield this.startAsRoot(pkg);
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    startAsRoot(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield execa_1.default('sudo', ['brew', 'services', 'start', pkg], { shell: true });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    stopAsRoot(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield execa_1.default('sudo', ['brew', 'services', 'stop', pkg], { shell: true });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    link(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield execa_1.default('brew', ['link', '--overwrite', '--force', pkg], { shell: true });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    unlink(pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield execa_1.default('brew', ['unlink', pkg], { shell: true });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = BrewServices;
//# sourceMappingURL=brewServices.js.map