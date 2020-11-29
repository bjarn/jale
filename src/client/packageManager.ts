abstract class PackageManager {
    name: string | undefined
    path: string | undefined
    alias: string | undefined

    abstract install(pkg: string): boolean

    abstract remove(pkg: string): boolean

    abstract update(): boolean

    abstract upgrade(pkg: string | undefined): boolean

    abstract packageIsInstalled(pkg: string): Promise<boolean>
}

export default PackageManager