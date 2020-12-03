"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const customTool_1 = tslib_1.__importDefault(require("./customTool"));
class Magerun extends customTool_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'magerun';
        this.name = 'N98-Magerun';
        this.shasum = '6644c9138996e6015934a82d2b9d682c1aba5fbcc4816fd7397d6b78b05683b0';
        this.url = 'https://files.magerun.net/n98-magerun-2.0.0.phar';
    }
}
exports.default = Magerun;
//# sourceMappingURL=magerun.js.map