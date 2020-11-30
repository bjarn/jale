"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const redis_1 = tslib_1.__importDefault(require("../templates/redis"));
const service_1 = tslib_1.__importDefault(require("./service"));
class Redis extends service_1.default {
    constructor() {
        super(...arguments);
        this.requireRoot = true;
        this.service = 'redis';
        // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
        this.configPath = `/usr/local/etc/redis.conf`;
        this.configure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.writeFileSync(this.configPath, redis_1.default);
                return true;
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = Redis;
//# sourceMappingURL=redis.js.map