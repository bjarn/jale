"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sitesController_1 = tslib_1.__importDefault(require("../controllers/sitesController"));
const console_1 = require("../utils/console");
exports.default = (program) => program
    .command('links')
    .description('List all Nginx vhost configurations')
    .action(() => {
    (new sitesController_1.default()).listLinks().catch(err => console_1.error(err.message));
});
//# sourceMappingURL=linksCommand.js.map