"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sitesController_1 = tslib_1.__importDefault(require("../controllers/sitesController"));
const console_1 = require("../utils/console");
exports.default = (program) => program
    .command('unlink')
    .description('Remove the Nginx vhost configuration for your current project.')
    .action(() => {
    (new sitesController_1.default()).executeUnlink().catch(err => console_1.error(err.message));
});
//# sourceMappingURL=unlinkCommand.js.map