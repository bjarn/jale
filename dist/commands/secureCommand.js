"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const secureController_1 = tslib_1.__importDefault(require("../controllers/secureController"));
exports.default = (program) => program
    .command('secure [status]')
    .description('Create a self-signed SSL certificate for your site.')
    .action((status) => {
    (new secureController_1.default()).execute(status).catch(err => console.log(err.message));
});
//# sourceMappingURL=secureCommand.js.map