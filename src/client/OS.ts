import PackageManager from '../client/packageManager'
import Homebrew from '../client/packageManager/homebrew'
import ServiceCtl from '../client/serviceCtl'
import BrewServices from '../client/serviceCtl/brewServices'


export default class OS {
    private static instance: OS;

    operatingSystem: string
    packageManager: PackageManager
    serviceCtl: ServiceCtl
    services: null
    usrLocalDir: string

    private constructor() {
        switch (`${process.platform}_${process.arch}`) {
        case 'darwin_arm64':
            this.operatingSystem = 'darwin_arm64'
            this.packageManager = Homebrew.getInstance()
            this.serviceCtl = BrewServices.getInstance()
            this.services = null
            this.usrLocalDir = '/opt/homebrew'
            break
        default: // darwin x64
            this.operatingSystem = 'darwin_x64'
            this.packageManager = Homebrew.getInstance()
            this.serviceCtl = BrewServices.getInstance()
            this.services = null
            this.usrLocalDir = '/usr/local'
            break
        }
    }

    public static getInstance(): OS {
        if (!OS.instance) {
            OS.instance = new OS()
        }

        return OS.instance
    }
}
