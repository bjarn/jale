import PhpFpm from './phpFpm'

class PhpFpm72 extends PhpFpm {
    isEndOfLife = true
    versionName = '7.2'

    service = `php@${this.versionName}`

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = `${this.configRootPath}/7.2/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/7.2/conf.d`
}

export default PhpFpm72