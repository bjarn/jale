"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sitesController_1 = tslib_1.__importDefault(require("../controllers/sitesController"));
const console_1 = require("../utils/console");
exports.default = (program) => program
    .command('link [name]')
    .option('-t, --type <type>', 'Provide a type for generating an optimized Nginx config. Supported: laravel, magento2, magento1.')
    .description('Create a new Nginx vhost config for your current project.')
    .action((name, options) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (new sitesController_1.default()).executeLink(options.type, name).catch(err => console_1.error(err.message));
});
//# sourceMappingURL=linkCommand.js.map