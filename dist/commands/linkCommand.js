"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sitesController_1 = tslib_1.__importDefault(require("../controllers/sitesController"));
function installCommand(program) {
    return program
        .command('link')
        .description('Create a new Nginx vhost config for your current project.')
        .action(() => {
        (new sitesController_1.default()).executeLink().catch(err => console.log(err.message));
    });
}
exports.default = installCommand;
//# sourceMappingURL=linkCommand.js.map