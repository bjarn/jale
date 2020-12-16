"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const installController_1 = tslib_1.__importDefault(require("../controllers/installController"));
const console_1 = require("../utils/console");
exports.default = (program) => program
    .command('install')
    .description('Run the initial setup of Jale')
    .action(() => {
    (new installController_1.default()).execute().catch(err => console_1.error(err.message));
});
//# sourceMappingURL=installCommand.js.map