import PackageManager from './packageManager'

interface Client {
    // OS, Package Manager, Services
    operatingSystem: string
    packageManager: PackageManager,
    services: any // when services are ready, add them.
}