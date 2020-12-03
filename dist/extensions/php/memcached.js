"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phpExtension_1 = tslib_1.__importDefault(require("../phpExtension"));
class Memcached extends phpExtension_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'memcached';
        this.extension = 'memcached';
        this.default = false;
    }
}
exports.default = Memcached;
//# sourceMappingURL=memcached.js.map