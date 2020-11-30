import PhpFpm from './phpFpm'

class PhpFpm72 extends PhpFpm {
    service: string = 'php@7.2'
    isEndOfLife: boolean = true

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = `${this.configRootPath}/7.2/php-fpm.d/www.conf`
    iniDirectoryPath = `${this.configRootPath}/7.2/conf.d`

    configure(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

export default PhpFpm72