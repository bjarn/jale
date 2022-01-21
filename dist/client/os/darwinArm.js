"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const homebrew_1 = tslib_1.__importDefault(require("../packageManager/homebrew"));
const brewServices_1 = tslib_1.__importDefault(require("../serviceCtl/brewServices"));
class DarwinArm {
    constructor() {
        this.operatingSystem = 'darwin_arm64';
        this.packageManager = new homebrew_1.default;
        this.serviceCtl = new brewServices_1.default;
        this.services = null;
        this.usrLocalDir = '/opt/homebrew';
    }
}
exports.default = DarwinArm;
//# sourceMappingURL=darwinArm.js.map