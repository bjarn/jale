import execa from 'execa'
import {error, info, success, warning} from '../utils/console'
import Tool from './tool'

class Expose extends Tool {
    alias = 'expose'
    name = 'Beyondcode Expose'

    /**
     * Install the app.
     */
    install = async (): Promise<boolean> => {
        if (await this.isInstalled()) {
            warning(`${this.name} already is installed. Execute it by running ${this.alias}`)
            return false
        }

        info(`Installing ${this.name} using Composer...`)

        await execa('composer', ['global', 'require', 'beyondcode/expose'])

        success(`Successfully installed ${this.name}.`)

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

        info(`Uninstalling ${this.name} using Composer...`)

        await execa('composer', ['global', 'remove', 'beyondcode/expose'])

        success(`Successfully uninstalled ${this.name}.`)

        return true
    }

    /**
     * Check if the app is already installed..
     */
    isInstalled = async (): Promise<boolean> => {
        const {stdout} = await execa('composer', ['global', 'show', '-i'])
        return stdout.includes('beyondcode/expose')
    }
}

export default Expose