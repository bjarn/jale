import {jaleLogsPath, jaleNginxAppTemplatesPath} from '../../../utils/jale'

const nginxMagento2SiteConf = (hostname: string, docroot: string): string => `
    map $http_host $MAGE_RUN_CODE {
        hostnames;
        default default;
    }
    server {
    listen 80;
    listen [::]:80;
    server_name www.${hostname} ${hostname};
    client_max_body_size 128M;
    
    set $MAGE_ROOT ${docroot};
    set $MAGE_MODE developer;

    access_log off;
    error_log ${jaleLogsPath}/nginx/${hostname}-error.log;
    
    include ${jaleNginxAppTemplatesPath}/magento2.conf;
}
`

export default nginxMagento2SiteConf