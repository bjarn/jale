"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os_1 = require("../utils/os");
class Service {
    constructor() {
        this.requireRoot = false;
        this.start = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.requireRoot ?
                os_1.client().serviceCtl.startAsRoot(this.service) :
                os_1.client().serviceCtl.start(this.service);
        });
        this.stop = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.requireRoot ?
                os_1.client().serviceCtl.stopAsRoot(this.service) :
                os_1.client().serviceCtl.stop(this.service);
        });
        this.restart = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.requireRoot ?
                os_1.client().serviceCtl.restartAsRoot(this.service) :
                os_1.client().serviceCtl.restart(this.service);
        });
        this.reload = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.requireRoot ?
                os_1.client().serviceCtl.reloadAsRoot(this.service) :
                os_1.client().serviceCtl.reload(this.service);
        });
        this.install = () => {
            return os_1.client().packageManager.install(this.service, false);
        };
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map