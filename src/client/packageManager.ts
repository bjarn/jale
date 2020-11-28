interface PackageManager {
    name: string
    path: string
    alias: string

    installCommand: string
    removeCommand: string
    updateCommand: string
    upgradeCommand: string
}