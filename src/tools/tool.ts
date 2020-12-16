import {error, info, success} from '../utils/console'
import {client} from '../utils/os'

abstract class Tool {

    abstract name: string
    abstract alias: string

    /**
     * Install the app.
     */
    install = async (): Promise<boolean> => {
        if (await this.isInstalled()) {
            error(`${this.name} already is installed.`)
            return false
        }

        info(`Installing ${this.name}...`)
        await client().packageManager.install(this.alias, false)
        return true
    }

    /**
     * Uninstall the app.
     */
    uninstall = async (): Promise<boolean> => {
        if (!(await this.isInstalled())) {
            error(`${this.name} is not installed.`)
            return false
        }

        info(`Uninstalling ${this.name}...`)

        await client().packageManager.uninstall(this.alias, false)

        success(`Uninstalled ${this.name}.`)

        return true
    }

    /**
     * Check if app the is already installed..
     */
    isInstalled = async (): Promise<boolean> => {
        return client().packageManager.packageIsInstalled(this.alias)
    }

}

export default Tool