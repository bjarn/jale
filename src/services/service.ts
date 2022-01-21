import OS from '../client/OS'

abstract class Service {
    abstract service: string
    requireRoot = false

    start = async (): Promise<boolean> =>
        this.requireRoot ?
            OS.getInstance().serviceCtl.startAsRoot(this.service) :
            OS.getInstance().serviceCtl.start(this.service)

    stop = async (): Promise<boolean> =>
        this.requireRoot ?
            OS.getInstance().serviceCtl.stopAsRoot(this.service) :
            OS.getInstance().serviceCtl.stop(this.service)

    restart = async (): Promise<boolean> =>
        this.requireRoot ?
            OS.getInstance().serviceCtl.restartAsRoot(this.service) :
            OS.getInstance().serviceCtl.restart(this.service)

    reload = async (): Promise<boolean> =>
        this.requireRoot ?
            OS.getInstance().serviceCtl.reloadAsRoot(this.service) :
            OS.getInstance().serviceCtl.reload(this.service)

    install = (): Promise<boolean> => {
        return OS.getInstance().packageManager.install(this.service, false)
    }

    uninstall = (): Promise<boolean> => {
        return OS.getInstance().packageManager.uninstall(this.service, false)
    }

    abstract configure(): Promise<boolean>
}

export default Service
