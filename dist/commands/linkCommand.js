"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sitesController_1 = tslib_1.__importDefault(require("../controllers/sitesController"));
function linkCommand(program) {
    return program
        .command('link')
        .description('Create a new Nginx vhost config for your current project.')
        .action(() => {
        (new sitesController_1.default()).executeLink().catch(err => console.log(err.message));
    });
}
exports.default = linkCommand;
//# sourceMappingURL=linkCommand.js.map