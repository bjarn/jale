"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptionalServiceByname = void 0;
const tslib_1 = require("tslib");
const elasticsearch_1 = tslib_1.__importDefault(require("../services/elasticsearch"));
const redis_1 = tslib_1.__importDefault(require("../services/redis"));
const getOptionalServiceByname = (serviceName) => {
    let service;
    switch (serviceName) {
        case (new redis_1.default).service:
            service = new redis_1.default();
            break;
        case (new elasticsearch_1.default).service:
            service = new elasticsearch_1.default();
            break;
        default:
            throw Error('Invalid service: ' + serviceName);
    }
    return service;
};
exports.getOptionalServiceByname = getOptionalServiceByname;
//# sourceMappingURL=optionalService.js.map