import execa from 'execa'

class Homebrew extends PackageManager {
    alias: string = 'brew'
    name: string = 'Homebrew'
    path: string = '/usr/local/bin/brew'

    install(pkg: string): boolean {
        return false;
    }

    /**
     * Check if the pkg is installed.
     *
     * @param pkg
     */
    async packageIsInstalled(pkg: string): Promise<boolean> {
        const {stdout} = await execa('brew', ['list', '--formulas'])

        return stdout.includes(pkg)
    }

    remove(pkg: string): boolean {
        return false;
    }

    update(): boolean {
        return false;
    }

    upgrade(pkg: string | undefined): boolean {
        return false;
    }
}

export default Homebrew