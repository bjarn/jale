import execa from 'execa'
import ServiceCtl from '../serviceCtl'

class BrewServices extends ServiceCtl {
    alias: string = 'brew'
    name: string = 'Homebrew'
    path: string = '/usr/local/bin/brew'

    async reload(pkg: string): Promise<boolean> {
        try {
            await execa('brew', ['services', 'reload', pkg])
            return true
        } catch (e) {
            return false
        }
    }

    async restart(pkg: string): Promise<boolean> {
        try {
            await execa('brew', ['services', 'restart', pkg])
            return true
        } catch (e) {
            return false
        }
    }

    async start(pkg: string): Promise<boolean> {
        try {
            await execa('brew', ['services', 'start', pkg])
            return true
        } catch (e) {
            return false
        }
    }

    async stop(pkg: string): Promise<boolean> {
        try {
            await execa('brew', ['services', 'stop', pkg])
            return true
        } catch (e) {
            return false
        }
    }
}

export default BrewServices