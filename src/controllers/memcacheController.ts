import Memcached from '../extensions/php/memcached'
import Memcache from '../services/memcache'
import {client} from '../utils/os'
import {getLinkedPhpVersion} from '../utils/phpFpm'

class MemcacheController {

    /**
     * Switch the service to the given version.
     */
    execute = async (status: string): Promise<boolean> => {
        if (status !== 'on' && status !== 'off') {
            console.log('Invalid status. Please provide status \'on\' or \'off\'.')
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

        if (await client().packageManager.packageIsInstalled(memcache.service)) {
            console.log(`${memcache.service} is already installed.`)
        } else {
            restart = true
            console.log(`Installing ${memcache.service}...`)
            await memcache.install()
            console.log(`${memcache.service} has been installed`)
        }

        console.log('Install Memcached PHP extension...')

        // Memcache is ready, now install the PHP extension.
        const phpExtensionInstalled = await phpMemcached.install()

        return restart || phpExtensionInstalled
    }

    disable = async (memcache: Memcache, phpMemcached: Memcached): Promise<boolean> => {
        const phpExtensionDisabled = await phpMemcached.disable()

        if (phpExtensionDisabled) {
            console.log('Disabled memcache\'s PHP extension')
        } else {
            console.log('Memcache\'s PHP extension was not enabled.')
        }

        if (!(await client().packageManager.packageIsInstalled(memcache.service))) {
            console.log(`${memcache.service} was not installed.`)
            return phpExtensionDisabled
        }

        console.log(`Uninstalling ${memcache.service}...`)
        await memcache.uninstall()
        console.log(`${memcache.service} has been uninstalled`)

        return true
    }

}

export default MemcacheController