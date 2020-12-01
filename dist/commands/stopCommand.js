"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const serviceController_1 = tslib_1.__importDefault(require("../controllers/serviceController"));
function installCommand(program) {
    return program
        .command('stop [service]')
        .description('Stop all or a specific service.')
        .action((service) => {
        (new serviceController_1.default()).executeStop(service).catch(err => console.log(err.message));
    });
}
exports.default = installCommand;
//# sourceMappingURL=stopCommand.js.map