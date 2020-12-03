"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phpExtension_1 = tslib_1.__importDefault(require("../phpExtension"));
class Geoip extends phpExtension_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'geoip';
        this.extension = 'geoip';
    }
}
exports.default = Geoip;
//# sourceMappingURL=geoip.js.map