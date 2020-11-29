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

    configure = (): Promise<boolean> => Promise.resolve(false)

}

export default Dnsmasq