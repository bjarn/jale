"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nginxElasticsearchConf = (domain) => `server {
    listen 80;
    server_name elasticsearch.${domain} www.elasticsearch.${domain};
    charset utf-8;
    client_max_body_size 128M;

    location / {
        chunked_transfer_encoding on;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
        proxy_redirect off;
        proxy_buffering off;
        proxy_pass http://localhost:9200;
    }
}
`;
exports.default = nginxElasticsearchConf;
//# sourceMappingURL=elasticsearch.js.map