"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sheepdog_1 = require("../utils/sheepdog");
const sheepdogNginxConf = `server {
    listen 80 default_server;
    root /;
    charset utf-8;
    client_max_body_size 128M;

    location / {
        rewrite ^ ${sheepdog_1.sheepdogFallbackServer} last;
    }

    access_log off;
    error_log ${sheepdog_1.sheepdogLogsPath}/nginx/error.log;

    error_page 404 ${sheepdog_1.sheepdogFallbackServer};

    location ~ \\.php$ {
        fastcgi_split_path_info ^(.+\\.php)(/.+)$;
        fastcgi_read_timeout 3600;
        fastcgi_pass unix:${sheepdog_1.sheepdogHomeDir}/sheepdog.sock;
        fastcgi_index ${sheepdog_1.sheepdogFallbackServer};
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME ${sheepdog_1.sheepdogFallbackServer};
        fastcgi_param SERVER_NAME $host;
    }

    location ~ /\\.ht {
        deny all;
    }
}`;
exports.default = sheepdogNginxConf;
//# sourceMappingURL=nginxSheepdog.js.map