import PhpFpm from './phpFpm'

class PhpFpm73 extends PhpFpm {
    isEndOfLife = false
    versionName = '7.3'

    service = `php@${this.versionName}`


    configPath = `${this.configRootPath}/7.3/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/7.3/conf.d`
}

export default PhpFpm73
