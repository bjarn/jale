import execa from 'execa'
import ServiceCtl from '../serviceCtl'

class BrewServices extends ServiceCtl {
    private static instance: BrewServices;

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

    public static getInstance(): ServiceCtl {
        if (!BrewServices.instance) {
            BrewServices.instance = new BrewServices()
        }

        return BrewServices.instance
    }

    async reload(pkg: string): Promise<boolean> {
        try {
            await execa('brew', ['services', 'reload', pkg], {shell: true})
            return true
        } catch (e) {
            return false
        }
    }

    async restart(pkg: string): Promise<boolean> {
        try {
            await execa('brew', ['services', 'restart', pkg], {shell: true})
            return true
        } catch (e) {
            return false
        }
    }

    async start(pkg: string): Promise<boolean> {
        await execa('brew', ['services', 'start', pkg], {shell: true})
        return true
    }

    async stop(pkg: string): Promise<boolean> {
        try {
            await execa('brew', ['services', 'stop', pkg], {shell: true})
            return true
        } catch (e) {
            return false
        }
    }

    async reloadAsRoot(pkg: string): Promise<boolean> {
        try {
            await execa('sudo', ['brew', 'services', 'reload', pkg], {shell: true})
            return true
        } catch (e) {
            return false
        }
    }

    async restartAsRoot(pkg: string): Promise<boolean> {
        try {
            await execa('sudo', ['brew', 'services', 'restart', pkg], {shell: true})
            return true
        } catch (e) {
            return false
        }
    }

    async startAsRoot(pkg: string): Promise<boolean> {
        try {
            await execa('sudo', ['brew', 'services', 'start', pkg], {shell: true})
            return true
        } catch (e) {
            return false
        }
    }

    async stopAsRoot(pkg: string): Promise<boolean> {
        try {
            await execa('sudo', ['brew', 'services', 'stop', pkg], {shell: true})
            return true
        } catch (e) {
            return false
        }
    }

    async link(pkg: string): Promise<boolean> {
        try {
            await execa('brew', ['link', '--overwrite', '--force', pkg], {shell: true})
            return true
        } catch (e) {
            return false
        }
    }

    async unlink(pkg: string): Promise<boolean> {
        try {
            await execa('brew', ['unlink', pkg], {shell: true})
            return true
        } catch (e) {
            return false
        }
    }
}

export default BrewServices
