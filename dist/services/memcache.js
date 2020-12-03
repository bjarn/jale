"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const service_1 = tslib_1.__importDefault(require("./service"));
class Memcache extends service_1.default {
    constructor() {
        super(...arguments);
        this.requireRoot = false;
        this.service = 'libmemcached';
    }
    configure() {
        return Promise.resolve(false);
    }
}
exports.default = Memcache;
//# sourceMappingURL=memcache.js.map