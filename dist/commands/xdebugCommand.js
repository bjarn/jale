"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const xdebugController_1 = tslib_1.__importDefault(require("../controllers/xdebugController"));
const console_1 = require("../utils/console");
exports.default = (program) => program
    .command('xdebug <status>')
    .description('Enable or disable the xdebug PHP extension. Use \'on\' or \'off\'.')
    .action((status) => {
    (new xdebugController_1.default()).execute(status).catch(err => console_1.error(err.message));
});
//# sourceMappingURL=xdebugCommand.js.map