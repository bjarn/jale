"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const memcacheController_1 = tslib_1.__importDefault(require("../controllers/memcacheController"));
exports.default = (program) => program
    .command('memcache <status>')
    .description('Enable or disable Memcache. Use \'on\' or \'off\'.')
    .action((status) => {
    (new memcacheController_1.default()).execute(status).catch(err => console.log(err.message));
});
//# sourceMappingURL=memcacheCommand.js.map