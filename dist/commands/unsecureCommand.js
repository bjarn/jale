"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const secureController_1 = tslib_1.__importDefault(require("../controllers/secureController"));
exports.default = (program) => program
    .command('unsecure')
    .description('Unsecure a site and remove its self-signed certificate.')
    .action(() => {
    (new secureController_1.default()).executeUnsecure().catch(err => console.log(err.message));
});
//# sourceMappingURL=unsecureCommand.js.map