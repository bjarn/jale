import PhpFpm from './phpFpm'

class PhpFpm72 extends PhpFpm {
    service: string = 'php@7.2'
    isEndOfLife: boolean = true

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = '/usr/local/etc/valet-php'

    configure(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

export default PhpFpm72