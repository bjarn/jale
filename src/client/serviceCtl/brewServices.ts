import execa from 'execa'
import ServiceCtl from '../serviceCtl'

class BrewServices extends ServiceCtl {
    alias = 'brew'
    name = 'Homebrew'
    path = '/usr/local/bin/brew'

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