import {jaleFallbackServer, jaleHomeDir, jaleLogsPath} from '../../utils/jale'

const jaleNginxConf = `server {
    listen 80 default_server;
    root /;
    charset utf-8;
    client_max_body_size 128M;

    location / {
        rewrite ^ ${jaleFallbackServer} last;
    }

    access_log off;
    error_log ${jaleLogsPath}/nginx/error.log;

    error_page 404 ${jaleFallbackServer};

    location ~ \\.php$ {
        fastcgi_split_path_info ^(.+\\.php)(/.+)$;
        fastcgi_read_timeout 3600;
        fastcgi_pass unix:${jaleHomeDir}/jale.sock;
        fastcgi_index ${jaleFallbackServer};
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME ${jaleFallbackServer};
        fastcgi_param SERVER_NAME $host;
    }

    location ~ /\\.ht {
        deny all;
    }
}`

export default jaleNginxConf