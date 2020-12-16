"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const secureController_1 = tslib_1.__importDefault(require("../controllers/secureController"));
const console_1 = require("../utils/console");
exports.default = (program) => program
    .command('secure')
    .description('Secure a site with a self-signed SSL.')
    .action(() => {
    (new secureController_1.default()).executeSecure().catch(err => console_1.error(err.message));
});
//# sourceMappingURL=secureCommand.js.map