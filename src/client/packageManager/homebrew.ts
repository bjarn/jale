import execa from 'execa'
import PackageManager from '../packageManager'

class Homebrew extends PackageManager {
    alias: string = 'brew'
    name: string = 'Homebrew'
    path: string = '/usr/local/bin/brew'

    async install(pkg: string, cask: boolean = false): Promise<boolean> {
        let args: string[] = ['install', pkg]

        if (cask) {
            args = ['cask', 'install', pkg]
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

    remove(pkg: string): Promise<boolean> {
        return Promise.resolve(false)
    }

    update(): Promise<boolean> {
        return Promise.resolve(false)
    }

    upgrade(pkg: string | undefined): Promise<boolean> {
        return Promise.resolve(false)
    }
}

export default Homebrew