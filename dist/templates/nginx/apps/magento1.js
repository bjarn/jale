"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jale_1 = require("../../../utils/jale");
const nginxMagento1Template = (hostname, docroot) => `
map $http_host $MAGE_RUN_CODE {
    hostnames;
    default default;
}
    
server {
    listen 80;
    listen [::]:80;
    server_name www.${hostname} ${hostname};
    client_max_body_size 128M;

    root ${docroot};
    index index.php;

    access_log off;
    error_log ${jale_1.jaleLogsPath}/nginx/${hostname}-error.log;
    
    include ${jale_1.jaleNginxAppTemplatesPath}/magento1.conf;
}
`;
exports.default = nginxMagento1Template;
//# sourceMappingURL=magento1.js.map