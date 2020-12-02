"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phpExtension_1 = tslib_1.__importDefault(require("../phpExtension"));
class Yaml extends phpExtension_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'yaml';
        this.extension = 'yaml';
    }
}
exports.default = Yaml;
//# sourceMappingURL=yaml.js.map