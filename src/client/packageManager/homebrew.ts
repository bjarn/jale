import execa from 'execa'
import PackageManager from '../packageManager'

class Homebrew extends PackageManager {
    alias = 'brew'
    name = 'Homebrew'
    path = '/usr/local/bin/brew'

    /**
     * Uninstall a package. In case of brew, the cask variable should be true of it ain't a formula but a cask.
     *
     * @param pkg
     * @param cask
     */
    async install(pkg: string, cask = false): Promise<boolean> {
        let args: string[] = ['install', pkg]

        if (cask) {
            args = ['cask', 'install', pkg]
        }

        const {stdout} = await execa('brew', args)

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
            args = ['cask', 'remove', pkg]
        }

        const {stdout} = await execa('brew', args)

        return stdout.includes(pkg)
    }

    /**
     * Check if the pkg is installed.
     *
     * @param pkg
     */
    async packageIsInstalled(pkg: string): Promise<boolean> {
        const {stdout} = await execa('brew', ['list', '--formula'])

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