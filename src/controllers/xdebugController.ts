import Xdebug from '../extensions/php/xdebug'
import {error, info, warning} from '../utils/console'
import {getLinkedPhpVersion} from '../utils/phpFpm'

class XdebugController {

    /**
     * Switch the service to the given version.
     */
    execute = async (status: string): Promise<boolean> => {
        if (status !== 'on' && status !== 'off') {
            error('Invalid status. Please provide status \'on\' or \'off\'.')
            return false
        }

        const xdebug = new Xdebug()
        let restart = false

        if (status === 'on') {
            restart = await this.enable(xdebug)
        }

        if (status === 'off') {
            restart = await this.disable(xdebug)
        }

        if (restart) {
            const php = await getLinkedPhpVersion()
            await php.restart()
        }

        return true
    }

    enable = async (xdebug: Xdebug): Promise<boolean> => {
        if (!(await xdebug.isInstalled())) {
            info('Extension xdebug is not installed. Installing now...')
            await xdebug.install()
        }

        // TODO: Enable auto start configuration for xdebug.

        info('Enabling xdebug...')
        await xdebug.enable()

        return true
    }

    disable = async (xdebug: Xdebug): Promise<boolean> => {
        if (!(await xdebug.isInstalled())) {
            warning('Extension xdebug is not installed. We do not need to disable it then...')
            return false
        }

        if (!(await xdebug.isEnabled())) {
            warning('Extension xdebug is not enabled.')
            return false
        }

        await xdebug.disable()

        return true
    }

}

export default XdebugController