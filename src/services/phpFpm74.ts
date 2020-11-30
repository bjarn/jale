import PhpFpm from './phpFpm'

class PhpFpm74 extends PhpFpm {
    service: string = 'php@7.4'
    isEndOfLife: boolean = false

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = '/usr/local/etc/valet-php'

    configure(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

export default PhpFpm74