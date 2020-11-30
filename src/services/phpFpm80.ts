import PhpFpm from './phpFpm'

class PhpFpm80 extends PhpFpm {
    service: string = 'php' // Is the latest version, should be changed to 8.0 when 8.1 gets released.
    isEndOfLife: boolean = false

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = `${this.configRootPath}/8.0/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/8.0/conf.d`

    configure(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

export default PhpFpm80