import execa from 'execa'
import PackageManager from '../packageManager'

class Homebrew extends PackageManager {
    private static instance: Homebrew;

    alias: string
    name: string
    path: string

    private constructor() {
        super()

        let usrLocalDir
        switch (`${process.platform}_${process.arch}`) {
        case 'darwin_arm64':
            usrLocalDir = '/opt/homebrew'
            break
        default: // darwin x64
            usrLocalDir = '/usr/local'
            break
        }

        this.alias = 'brew'
        this.name = 'Homebrew'
        this.path = `${usrLocalDir}/bin/brew`
    }

    public static getInstance(): PackageManager {
        if (!Homebrew.instance) {
            Homebrew.instance = new Homebrew()
        }

        return Homebrew.instance
    }

    /**
     * Install a package. In case of brew, the cask variable should be true of it ain't a formula but a cask.
     *
     * @param pkg
     * @param cask
     */
    async install(pkg: string, cask = false): Promise<boolean> {
        let args: string[] = ['install', pkg]

        if (cask) {
            args = ['install', 'cask', pkg]
        }

        const {stdout} = await execa('brew', args, {shell: true})

        return stdout.includes(pkg)
    }

    /**
     * Uninstall a package. In case of brew, the cask variable should be true of it ain't a formula but a cask.
     *
     * @param pkg
     * @param cask
     */
    async uninstall(pkg: string, cask = false): Promise<boolean> {
        let args: string[] = ['remove', pkg]

        if (cask) {
            args = ['remove', 'cask', pkg]
        }

        const {stdout} = await execa('brew', args, {shell: true})

        return stdout.includes(pkg)
    }

    /**
     * Check if the pkg is installed.
     *
     * @param pkg
     */
    async packageIsInstalled(pkg: string): Promise<boolean> {
        const {stdout} = await execa('brew', ['list', '--formula'], {shell: true})

        return stdout.includes(pkg)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    remove(pkg: string): Promise<boolean> {
        return Promise.resolve(false)
    }

    update(): Promise<boolean> {
        return Promise.resolve(false)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    upgrade(pkg: string | undefined): Promise<boolean> {
        return Promise.resolve(false)
    }
}

export default Homebrew
