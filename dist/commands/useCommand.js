"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const useController_1 = tslib_1.__importDefault(require("../controllers/useController"));
const console_1 = require("../utils/console");
exports.default = (program) => program
    .command('use <service> <version>')
    .description('Switch a version of a specific service, i.e. use PHP 7.4 instead of 7.2.')
    .action((service, version) => {
    (new useController_1.default()).execute(service, version).catch(err => console_1.error(err.message));
});
//# sourceMappingURL=useCommand.js.map