"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jale_1 = require("../../../utils/jale");
const nginxMagento2SiteConf = (hostname, docroot) => `
    map $http_host $MAGE_RUN_CODE {
        hostnames;
        default default;
    }
    server {
    listen 80;
    listen [::]:80;
    server_name www.${hostname} ${hostname};
    client_max_body_size 128M;
    
    set $MAGE_ROOT ${docroot};
    set $MAGE_MODE developer;

    access_log off;
    error_log ${jale_1.jaleLogsPath}/nginx/${hostname}-error.log;
    
    include ${jale_1.jaleNginxAppTemplatesPath}/magento2.conf;
}
`;
exports.default = nginxMagento2SiteConf;
//# sourceMappingURL=magento2.js.map