import PhpFpm from './phpFpm'

class PhpFpm72 extends PhpFpm {
    isEndOfLife = true
    versionName = '7.2'

    service = `php@${this.versionName}`


    configPath = `${this.configRootPath}/7.2/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/7.2/conf.d`
}

export default PhpFpm72
