import Service from './service'

abstract class PhpFpm extends Service {
    isEndOfLife: boolean = false

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = '/usr/local/etc/valet-php'
}

export default PhpFpm