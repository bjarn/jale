import {jaleHomeDir, jaleLogsPath} from '../../../utils/jale'

const nginxShopware6Template = (hostname: string, docroot: string): string => `server {
    listen 80;
    listen [::]:80;
    server_name www.${hostname} ${hostname};
    root ${docroot}/public;
    client_max_body_size 128M;

    access_log off;
    error_log ${jaleLogsPath}/nginx/${hostname}-error.log;
    
    location /recovery/install {
        index index.php;
        try_files $uri /recovery/install/index.php$is_args$args;
    }
    
    location /recovery/update/ {
        location /recovery/update/assets {
        }
        if (!-e $request_filename){
            rewrite . /recovery/update/index.php last;
        }
    }
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        try_files $uri /index.php =404;
        fastcgi_split_path_info ^(.+\\.php)(/.+)$;
        fastcgi_read_timeout 3600;
        fastcgi_pass unix:${jaleHomeDir}/jale.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.ht {
        deny all;
    }
}`

export default nginxShopware6Template