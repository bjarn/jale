import delay from '../utils/delay'
import Service from './service'

class Dnsmasq extends Service {

    /**
     * Dnsmasq constructor
     * @param service
     * @param requireRoot
     */
    constructor(service: string = 'dnsmasq', requireRoot = true) {
        super(service, requireRoot);
    }

    configure = async (): Promise<boolean> => {
        await delay(5000)
        return Promise.resolve(false)
    }

}

export default Dnsmasq