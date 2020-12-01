abstract class PackageManager {
    abstract name: string
    abstract path: string
    abstract alias: string

    abstract install(pkg: string, cask: boolean = false): Promise<boolean>

    abstract remove(pkg: string): Promise<boolean>

    abstract update(): Promise<boolean>

    abstract upgrade(pkg: string | undefined): Promise<boolean>

    abstract packageIsInstalled(pkg: string): Promise<boolean>
}

export default PackageManager