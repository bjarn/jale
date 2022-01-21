import PhpFpm from './phpFpm'

class PhpFpm80 extends PhpFpm {
    isEndOfLife = false
    versionName = '8.1'

    // TODO: When PHP 8.2 is out, change this to php@8.1
    service = 'php'


    configPath = `${this.configRootPath}/8.0/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/8.0/conf.d`
}

export default PhpFpm80
