"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const OS_1 = tslib_1.__importDefault(require("../client/OS"));
const redis_1 = tslib_1.__importDefault(require("../templates/redis"));
const service_1 = tslib_1.__importDefault(require("./service"));
class Redis extends service_1.default {
    constructor() {
        super(...arguments);
        this.requireRoot = false;
        this.service = 'redis';
        this.configPath = `${OS_1.default.getInstance().usrLocalDir}/etc/redis.conf`;
        this.configure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield fs_1.writeFileSync(this.configPath, redis_1.default);
            return true;
        });
    }
}
exports.default = Redis;
//# sourceMappingURL=redis.js.map