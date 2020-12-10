import PhpFpm from './phpFpm'

class PhpFpm80 extends PhpFpm {
    isEndOfLife = false
    versionName = '8.0'

    service = `php@${this.versionName}`

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = `${this.configRootPath}/8.0/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/8.0/conf.d`
}

export default PhpFpm80