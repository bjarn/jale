import PackageManager from './packageManager'
import ServiceCtl from './serviceCtl'

interface Client {
    // OS, Package Manager, Services
    operatingSystem: string
    packageManager: PackageManager,
    serviceCtl: ServiceCtl,
    services: any // when services are ready, add them.
}

export default Client