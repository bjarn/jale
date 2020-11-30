import PhpFpm from './phpFpm'

class PhpFpm80 extends PhpFpm {
    service: string = 'php@8.0'
    isEndOfLife: boolean = false

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = `${this.configRootPath}/8.0/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/8.0/conf.d`
}

export default PhpFpm80