"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jale_1 = require("../../utils/jale");
const jaleNginxConf = `server {
    listen 80 default_server;
    root /;
    charset utf-8;
    client_max_body_size 128M;

    location / {
        rewrite ^ ${jale_1.jaleFallbackServer} last;
    }

    access_log off;
    error_log ${jale_1.jaleLogsPath}/nginx/error.log;

    error_page 404 ${jale_1.jaleFallbackServer};

    location ~ \\.php$ {
        fastcgi_split_path_info ^(.+\\.php)(/.+)$;
        fastcgi_read_timeout 3600;
        fastcgi_pass unix:${jale_1.jaleHomeDir}/jale.sock;
        fastcgi_index ${jale_1.jaleFallbackServer};
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME ${jale_1.jaleFallbackServer};
        fastcgi_param SERVER_NAME $host;
    }

    location ~ /\\.ht {
        deny all;
    }
}`;
exports.default = jaleNginxConf;
//# sourceMappingURL=jale.js.map