import PackageManager from './packageManager'
import ServiceCtl from './serviceCtl'

interface Client {
    // OS, Package Manager, Services
    operatingSystem: string
    packageManager: PackageManager,
    serviceCtl: ServiceCtl,
    services: null // TODO when services are managable, add them.
}

export default Client