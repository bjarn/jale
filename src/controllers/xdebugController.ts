import Pecl from '../extensions/pecl'
import Xdebug from '../extensions/php/xdebug'
import {getLinkedPhpVersion} from '../utils/phpFpm'

class XdebugController {

    /**
     * Switch the service to the given version.
     */
    execute = async (status: string): Promise<boolean> => {
        if (status !== 'on' && status !== 'off') {
            console.log(`Invalid status. Please provide status 'on' or 'off'.`)
            return false
        }

        const xdebug = new Xdebug()

        if (status === 'on') {
            await this.enable(xdebug)
        }

        if (status === 'off') {
            await this.disable(xdebug)
        }

        const php = await getLinkedPhpVersion()
        return php.restart()
    }

    enable = async (xdebug: Xdebug): Promise<void> => {
        if (!(await xdebug.isInstalled())) {
            console.log('Extension xdebug is not installed. Installing now...')
            await xdebug.install()
        }

        // TODO: Enable auto start configuration for xdebug.

        console.log('Enabling xdebug...')
        return xdebug.enable()
    }

    disable = async (xdebug: Xdebug): Promise<void> => {
        if (!(await xdebug.isInstalled())) {
            console.log('Extension xdebug is not installed. We do not need to disable it then...')
            return
        }

        if (!(await xdebug.isEnabled())) {
            console.log('Extension xdebug is not enabled.')
            return
        }

        return xdebug.disable()
    }

}

export default XdebugController