"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const elasticsearch_1 = tslib_1.__importDefault(require("../templates/nginx/elasticsearch"));
const os_1 = require("../utils/os");
const jale_1 = require("../utils/jale");
const nginx_1 = tslib_1.__importDefault(require("./nginx"));
const service_1 = tslib_1.__importDefault(require("./service"));
class Elasticsearch extends service_1.default {
    constructor() {
        super(...arguments);
        this.requireRoot = false;
        this.service = 'elasticsearch';
        // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
        this.configPath = '/usr/local/etc/elasticsearch/elasticsearch.yml';
        this.dataPath = 'path.data';
        this.dataRootPath = '/usr/local/var';
        this.nginxConfigPath = `${jale_1.jaleNginxAppsPath}/elasticsearch.conf`;
        this.install = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield os_1.client().packageManager.install('homebrew/cask-versions/adoptopenjdk8', true);
            yield os_1.client().packageManager.install('libyaml', false);
            yield os_1.client().packageManager.install(this.service, false);
            return true;
        });
        this.configure = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield jale_1.getConfig();
            yield fs_1.writeFileSync(this.nginxConfigPath, elasticsearch_1.default(config.tld));
            yield (new nginx_1.default).restart();
            return true;
        });
    }
}
exports.default = Elasticsearch;
//# sourceMappingURL=elasticsearch.js.map