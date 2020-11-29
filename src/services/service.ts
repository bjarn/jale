import {client} from '../utils/os'

abstract class Service {
    service: string
    requireRoot: boolean = false

    /**
     * Service constructor
     * @param service
     * @param requireRoot
     */
    protected constructor(service: string, requireRoot = false) {
        this.service = service
        this.requireRoot = requireRoot
    }

    start = async (): Promise<boolean> => client().serviceCtl.start(this.service)

    stop = async (): Promise<boolean> => client().serviceCtl.stop(this.service)

    restart = async (): Promise<boolean> => client().serviceCtl.restart(this.service)

    install = (): Promise<boolean> => {
        return client().packageManager.install(this.service)
    }

    abstract configure(): Promise<boolean>
}

export default Service