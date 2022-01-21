import OS from '../client/OS'
import Memcached from '../extensions/php/memcached'
import Memcache from '../services/memcache'
import {error, info, success, warning} from '../utils/console'
import {getLinkedPhpVersion} from '../utils/phpFpm'

class MemcacheController {

    /**
     * Switch the service to the given version.
     */
    execute = async (status: string): Promise<boolean> => {
        if (status !== 'on' && status !== 'off') {
            error('Invalid status. Please provide status \'on\' or \'off\'.')
            return false
        }

        const memcache = new Memcache()
        const phpMemcached = new Memcached()
        let restart = false

        if (status === 'on') {
            restart = await this.enable(memcache, phpMemcached)
        }

        if (status === 'off') {
            restart = await this.disable(memcache, phpMemcached)
        }

        if (restart) {
            const php = await getLinkedPhpVersion()
            await php.restart()
        }

        return true
    }

    enable = async (memcache: Memcache, phpMemcached: Memcached): Promise<boolean> => {
        let restart = false

        if (await OS.getInstance().packageManager.packageIsInstalled(memcache.service)) {
            warning(`${memcache.service} is already installed.`)
        } else {
            restart = true
            info(`Installing ${memcache.service}...`)
            await memcache.install()
            success(`${memcache.service} has been installed.`)
        }

        info('Install Memcached PHP extension...')

        // Memcache is ready, now install the PHP extension.
        const phpExtensionInstalled = await phpMemcached.install()

        return restart || phpExtensionInstalled
    }

    disable = async (memcache: Memcache, phpMemcached: Memcached): Promise<boolean> => {
        const phpExtensionDisabled = await phpMemcached.disable()

        if (phpExtensionDisabled) {
            success('Disabled memcache\'s PHP extension.')
        } else {
            warning('Memcache\'s PHP extension was not enabled.')
        }

        if (!(await OS.getInstance().packageManager.packageIsInstalled(memcache.service))) {
            warning(`${memcache.service} was not installed.`)
            return phpExtensionDisabled
        }

        info(`Uninstalling ${memcache.service}...`)
        await memcache.uninstall()
        success(`${memcache.service} has been uninstalled.`)

        return true
    }

}

export default MemcacheController
