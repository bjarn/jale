"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jale_1 = require("../../utils/jale");
const nginxMagento1Conf = `
## These locations would be hidden by .htaccess normally 
location ^~ /app/                { deny all; } 
location ^~ /includes/           { deny all; } 
location ^~ /lib/                { deny all; } 
location ^~ /media/downloadable/ { deny all; } 
location ^~ /pkginfo/            { deny all; } 
location ^~ /report/config.xml   { deny all; } 
location ^~ /var/                { deny all; } 
location /var/export/            { deny all; } 
 
# deny htaccess files 
location ~ /\\. { 
deny  all; 
access_log off; 
log_not_found off; 
} 
 
location ~*  \\.(jpg|jpeg|png|gif|ico)$ { 
    log_not_found off; 
    access_log off; 
} 
 
location ~ .php/ { 
    rewrite ^(.*.php)/ $1 last; 
}

location / { 
    index index.html index.php;
    try_files $uri $uri/ /index.php?$query_string;
    rewrite /api/rest /api.php?type=rest;
}
 
location ~ \\.php$ { 
    fastcgi_read_timeout 3600;
    fastcgi_pass unix:${jale_1.jaleHomeDir}/jale.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param  MAGE_RUN_CODE $MAGE_RUN_CODE;
    include fastcgi_params;
    fastcgi_param MAGE_RUN_TYPE store;
}
`;
exports.default = nginxMagento1Conf;
//# sourceMappingURL=magento1.js.map