import {sheepdogFallbackServer, sheepdogHomeDir, sheepdogLogsPath} from '../utils/sheepdog'

const sheepdogNginxConf = `server {
    listen 80 default_server;
    root /;
    charset utf-8;
    client_max_body_size 128M;

    location / {
        rewrite ^ ${sheepdogFallbackServer} last;
    }

    access_log off;
    error_log ${sheepdogLogsPath}/nginx/error.log;

    error_page 404 ${sheepdogFallbackServer};

    location ~ \\.php$ {
        fastcgi_split_path_info ^(.+\\.php)(/.+)$;
        fastcgi_read_timeout 3600;
        fastcgi_pass unix:${sheepdogHomeDir}/sheepdog.sock;
        fastcgi_index ${sheepdogFallbackServer};
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME ${sheepdogFallbackServer};
        fastcgi_param SERVER_NAME $host;
    }

    location ~ /\\.ht {
        deny all;
    }
}`

export default sheepdogNginxConf