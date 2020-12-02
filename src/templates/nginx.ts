import * as os from 'os'
import {jaleSitesPath} from '../utils/jale'

const nginxConf = `user ${os.userInfo().username} staff;
worker_processes auto;

events {
    worker_connections  1024;
}

http {
    include mime.types;
    default_type  application/octet-stream;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout  65;
    client_max_body_size 128M;

    gzip  on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;

    gzip_types
    application/atom+xml
    application/javascript
    application/json
    application/rss+xml
    application/vnd.ms-fontobject
    application/x-font-ttf
    application/x-web-app-manifest+json
    application/xhtml+xml
    application/xml
    font/opentype
    image/svg+xml
    image/x-icon
    text/css
    text/plain
    text/x-component;

    include ${jaleSitesPath}/*;
    include jale/apps/*.conf;
    include jale/jale.conf;
}`

export default nginxConf