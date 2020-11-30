"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sheepdog_1 = require("../utils/sheepdog");
const nginxSiteConfig = (hostname, docroot) => `server {
    listen 80;
    listen [::]:80;
    server_name www.${hostname} ${hostname};
    root ${docroot};
    charset utf-8;
    client_max_body_size 128M;

    index index.php index.html;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    access_log off;
    error_log ${sheepdog_1.sheepdogLogsPath}/nginx/${hostname}-error.log;

    location ~ \\.php$ {
        try_files $uri /index.php =404;
        fastcgi_split_path_info ^(.+\\.php)(/.+)$;
        fastcgi_read_timeout 3600;
        fastcgi_pass unix:${sheepdog_1.sheepdogHomeDir}/sheepdog.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.ht {
        deny all;
    }
}`;
exports.default = nginxSiteConfig;
//# sourceMappingURL=nginxSite.js.map