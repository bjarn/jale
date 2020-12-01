import PhpFpm from './phpFpm'

class PhpFpm73 extends PhpFpm {
    isEndOfLife: boolean = false
    versionName: string = '7.3'

    service: string = `php@${this.versionName}`

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = `${this.configRootPath}/7.3/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/7.3/conf.d`
}

export default PhpFpm73