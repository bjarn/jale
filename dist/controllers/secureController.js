"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nginx_1 = tslib_1.__importDefault(require("../services/nginx"));
const jale_1 = require("../utils/jale");
class SecureController {
    constructor() {
        this.execute = (status) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (status !== undefined && (status !== 'on' && status !== 'off')) {
                console.log('Invalid status. Please use \'on\' or \'off\'.');
                return;
            }
            const config = yield jale_1.getConfig();
            const project = process.cwd().substring(process.cwd().lastIndexOf('/') + 1);
            const hostname = `${project}.${config.domain}`;
            const restartNginx = false;
            if (restartNginx)
                yield (new nginx_1.default()).reload();
        });
    }
}
exports.default = SecureController;
//# sourceMappingURL=secureController.js.map