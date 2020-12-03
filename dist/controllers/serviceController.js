"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dnsmasq_1 = tslib_1.__importDefault(require("../services/dnsmasq"));
const elasticsearch_1 = tslib_1.__importDefault(require("../services/elasticsearch"));
const mailhog_1 = tslib_1.__importDefault(require("../services/mailhog"));
const mariadb_1 = tslib_1.__importDefault(require("../services/mariadb"));
const mysql_1 = tslib_1.__importDefault(require("../services/mysql"));
const mysql57_1 = tslib_1.__importDefault(require("../services/mysql57"));
const mysql80_1 = tslib_1.__importDefault(require("../services/mysql80"));
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const phpFpm_1 = tslib_1.__importDefault(require("../services/phpFpm"));
const phpFpm72_1 = tslib_1.__importDefault(require("../services/phpFpm72"));
const phpFpm73_1 = tslib_1.__importDefault(require("../services/phpFpm73"));
const phpFpm74_1 = tslib_1.__importDefault(require("../services/phpFpm74"));
const phpFpm80_1 = tslib_1.__importDefault(require("../services/phpFpm80"));
const redis_1 = tslib_1.__importDefault(require("../services/redis"));
const database_1 = require("../utils/database");
const phpFpm_2 = require("../utils/phpFpm");
class ServiceController {
    constructor() {
        this.allServices = [
            new dnsmasq_1.default(),
            new elasticsearch_1.default(),
            new mailhog_1.default(),
            new nginx_1.default(),
            new mariadb_1.default(),
            new mysql80_1.default(),
            new mysql57_1.default(),
            new phpFpm80_1.default(),
            new phpFpm74_1.default(),
            new phpFpm73_1.default(),
            new phpFpm72_1.default(),
            new redis_1.default()
        ];
        this.executeStart = (serviceName) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!serviceName) {
                for (const service of this.allServices) {
                    try {
                        yield this.controlService(service, 'start');
                    }
                    catch (e) {
                        console.log(`Failed to start ${service.service}: ${e.message}`);
                    }
                }
                console.log(`Successfully started all Jale services.`);
                return true;
            }
            for (const service of this.allServices) {
                if (service.service === serviceName) {
                    console.log(`Starting ${service.service}...`);
                    try {
                        yield service.start();
                        console.log(`Successfully started ${serviceName}.`);
                        return true;
                    }
                    catch (e) {
                        console.log(`Failed to start ${service.service}: ${e.message}`);
                        return false;
                    }
                }
            }
            console.warn(`Invalid service: ${serviceName}.`);
            return false;
        });
        this.executeStop = (serviceName) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!serviceName) {
                for (const service of this.allServices) {
                    try {
                        yield this.controlService(service, 'stop');
                    }
                    catch (e) {
                        console.log(`Failed to stop ${service.service}: ${e.message}`);
                    }
                }
                console.log(`Successfully stopped all Jale services.`);
                return true;
            }
            for (const service of this.allServices) {
                if (service.service === serviceName) {
                    console.log(`Stopping ${service.service}...`);
                    try {
                        yield service.stop();
                        console.log(`Successfully stopped ${serviceName}.`);
                        return true;
                    }
                    catch (e) {
                        console.log(`Failed to stop ${service.service}: ${e.message}`);
                    }
                }
            }
            console.warn(`Invalid service: ${serviceName}.`);
            return false;
        });
        this.executeRestart = (serviceName) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!serviceName) {
                for (const service of this.allServices) {
                    try {
                        yield this.controlService(service, 'restart');
                    }
                    catch (e) {
                        console.log(`Failed to restarted ${service.service}: ${e.message}`);
                    }
                }
                console.log(`Successfully restarted all Jale services.`);
                return true;
            }
            for (const service of this.allServices) {
                if (service.service === serviceName) {
                    console.log(`Restarting ${service.service}...`);
                    try {
                        yield service.restart();
                        console.log(`Successfully restarted ${serviceName}.`);
                        return true;
                    }
                    catch (e) {
                        console.log(`Failed to restarted ${service.service}: ${e.message}`);
                        return false;
                    }
                }
            }
            console.warn(`Invalid service: ${serviceName}.`);
            return false;
        });
        /**
         * Convenience method to start, stop or restart a service. It also checks if you are restarting PHP or MySQL.
         * @param service
         * @param action
         */
        this.controlService = (service, action) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (service instanceof mysql_1.default) {
                const linkedDatabase = yield database_1.getLinkedDatabase();
                if (linkedDatabase.service !== service.service) {
                    return;
                }
            }
            if (service instanceof phpFpm_1.default) {
                const linkedPhpVersion = yield phpFpm_2.getLinkedPhpVersion();
                if (linkedPhpVersion.service !== service.service) {
                    return;
                }
            }
            switch (action) {
                case 'start':
                    console.log(`Starting ${service.service}...`);
                    yield service.start();
                    break;
                case 'stop':
                    console.log(`Stopping ${service.service}...`);
                    yield service.stop();
                    break;
                case 'restart':
                    console.log(`Retarting ${service.service}...`);
                    yield service.restart();
                    break;
            }
        });
    }
}
exports.default = ServiceController;
//# sourceMappingURL=serviceController.js.map