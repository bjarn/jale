"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const nginxMailhog_1 = tslib_1.__importDefault(require("../templates/nginxMailhog"));
const jale_1 = require("../utils/jale");
const nginx_1 = tslib_1.__importDefault(require("./nginx"));
const service_1 = tslib_1.__importDefault(require("./service"));
class Mailhog extends service_1.default {
    constructor() {
        super(...arguments);
        this.service = 'mailhog';
        // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
        this.nginxConfigPath = `${jale_1.jaleNginxAppsPath}/mailhog.conf`;
        this.configure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.addNginxConfiguration();
                yield (new nginx_1.default).restart();
                return true;
            }
            catch (e) {
                throw e;
            }
        });
        /**
         * Install the Mailhog Nginx configuration.
         */
        this.addNginxConfiguration = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield jale_1.getConfig();
            return fs.writeFileSync(this.nginxConfigPath, nginxMailhog_1.default(config.domain));
        });
    }
}
exports.default = Mailhog;
//# sourceMappingURL=mailhog.js.map