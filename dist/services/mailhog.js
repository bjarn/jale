"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const mailhog_1 = tslib_1.__importDefault(require("../templates/nginx/mailhog"));
const jale_1 = require("../utils/jale");
const nginx_1 = tslib_1.__importDefault(require("./nginx"));
const service_1 = tslib_1.__importDefault(require("./service"));
class Mailhog extends service_1.default {
    constructor() {
        super(...arguments);
        this.service = 'mailhog';
        this.nginxConfigPath = `${jale_1.jaleNginxAppsPath}/mailhog.conf`;
        this.configure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.addNginxConfiguration();
            yield (new nginx_1.default).restart();
            return true;
        });
        /**
         * Install the Mailhog Nginx configuration.
         */
        this.addNginxConfiguration = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield jale_1.getConfig();
            return fs.writeFileSync(this.nginxConfigPath, mailhog_1.default(config.tld));
        });
    }
}
exports.default = Mailhog;
//# sourceMappingURL=mailhog.js.map