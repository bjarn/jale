import {client} from '../utils/os'

abstract class App {

    abstract name: string
    abstract alias: string

    /**
     * Install the binary.
     */
    install = async (): Promise<boolean> => {
        if (await this.isInstalled()) {
            console.log(`${this.name} already is installed`)
            return false
        }

        console.log(`Installing ${this.name}...`)
        await client().packageManager.install(this.alias, false)
        return true
    }

    /**
     * Uninstall the binary
     */
    uninstall = async (): Promise<boolean> => {
        if (!(await this.isInstalled())) {
            console.log(`${this.name} is not installed`)
        }

        console.log(`Uninstalling ${this.name}...`)

        await client().packageManager.uninstall(this.alias, false)

        console.log(`Installed ${this.name}`)

        return true
    }

    /**
     * Check if the binary of the app exists.
     */
    isInstalled = async (): Promise<boolean> => {
        return client().packageManager.packageIsInstalled(this.alias)
    }

}

export default App