abstract class ServiceCtl {
    abstract name: string
    abstract path: string
    abstract alias: string

    abstract start(pkg: string): Promise<boolean>
    abstract startAsRoot(pkg: string): Promise<boolean>

    abstract stop(pkg: string): Promise<boolean>
    abstract stopAsRoot(pkg: string): Promise<boolean>

    abstract restart(pkg: string): Promise<boolean>
    abstract restartAsRoot(pkg: string): Promise<boolean>

    abstract reload(pkg: string): Promise<boolean>
    abstract reloadAsRoot(pkg: string): Promise<boolean>

    abstract link(pkg: string): Promise<boolean>

    abstract unlink(pkg: string): Promise<boolean>
}

export default ServiceCtl