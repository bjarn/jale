"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const homebrew_1 = tslib_1.__importDefault(require("../client/packageManager/homebrew"));
const brewServices_1 = tslib_1.__importDefault(require("../client/serviceCtl/brewServices"));
class OS {
    constructor() {
        switch (`${process.platform}_${process.arch}`) {
            case 'darwin_arm64':
                this.operatingSystem = 'darwin_arm64';
                this.packageManager = homebrew_1.default.getInstance();
                this.serviceCtl = brewServices_1.default.getInstance();
                this.services = null;
                this.usrLocalDir = '/opt/homebrew';
                break;
            default: // darwin x64
                this.operatingSystem = 'darwin_x64';
                this.packageManager = homebrew_1.default.getInstance();
                this.serviceCtl = brewServices_1.default.getInstance();
                this.services = null;
                this.usrLocalDir = '/usr/local';
                break;
        }
    }
    static getInstance() {
        if (!OS.instance) {
            OS.instance = new OS();
        }
        return OS.instance;
    }
}
exports.default = OS;
//# sourceMappingURL=OS.js.map