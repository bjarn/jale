import {jaleLogsPath, jaleNginxAppTemplatesPath} from '../../../utils/jale'

const nginxMagento1Template = (hostname: string, docroot: string): string => `
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
    error_log ${jaleLogsPath}/nginx/${hostname}-error.log;
    
    include ${jaleNginxAppTemplatesPath}/magento1.conf;
}
`

export default nginxMagento1Template