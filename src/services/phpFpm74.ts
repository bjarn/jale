import PhpFpm from './phpFpm'

class PhpFpm74 extends PhpFpm {
    isEndOfLife = false
    versionName = '7.4'

    service = `php@${this.versionName}`

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = `${this.configRootPath}/7.4/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/7.4/conf.d`
}

export default PhpFpm74