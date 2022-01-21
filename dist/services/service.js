"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const OS_1 = tslib_1.__importDefault(require("../client/OS"));
class Service {
    constructor() {
        this.requireRoot = false;
        this.start = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.requireRoot ?
                OS_1.default.getInstance().serviceCtl.startAsRoot(this.service) :
                OS_1.default.getInstance().serviceCtl.start(this.service);
        });
        this.stop = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.requireRoot ?
                OS_1.default.getInstance().serviceCtl.stopAsRoot(this.service) :
                OS_1.default.getInstance().serviceCtl.stop(this.service);
        });
        this.restart = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.requireRoot ?
                OS_1.default.getInstance().serviceCtl.restartAsRoot(this.service) :
                OS_1.default.getInstance().serviceCtl.restart(this.service);
        });
        this.reload = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.requireRoot ?
                OS_1.default.getInstance().serviceCtl.reloadAsRoot(this.service) :
                OS_1.default.getInstance().serviceCtl.reload(this.service);
        });
        this.install = () => {
            return OS_1.default.getInstance().packageManager.install(this.service, false);
        };
        this.uninstall = () => {
            return OS_1.default.getInstance().packageManager.uninstall(this.service, false);
        };
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map