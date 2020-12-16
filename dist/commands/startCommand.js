"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const serviceController_1 = tslib_1.__importDefault(require("../controllers/serviceController"));
const console_1 = require("../utils/console");
exports.default = (program) => program
    .command('start [service]')
    .description('Start all or a specific service.')
    .action((service) => {
    (new serviceController_1.default()).executeStart(service).catch(err => console_1.error(err.message));
});
//# sourceMappingURL=startCommand.js.map