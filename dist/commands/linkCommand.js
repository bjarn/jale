"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sitesController_1 = tslib_1.__importDefault(require("../controllers/sitesController"));
exports.default = (program) => program
    .command('link')
    .option('-t, --type <type>', 'Provide a type for generating an optimized Nginx config. Supported: laravel, magento2, magento1.')
    .description('Create a new Nginx vhost config for your current project.')
    .action((options) => {
    (new sitesController_1.default()).executeLink(options.type).catch(err => console.log(err.message));
});
//# sourceMappingURL=linkCommand.js.map