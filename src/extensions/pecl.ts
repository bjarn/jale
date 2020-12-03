import execa from 'execa'
import {existsSync} from 'fs'
import Apcu from './php/apcu'
import Geoip from './php/geoip'
import Memcached from './php/memcached'
import Xdebug from './php/xdebug'
import Yaml from './php/yaml'

class Pecl {
    /**
     * All extensions available in Jale.
     */
    static PHP_EXTENSIONS = [
        Apcu,
        Geoip,
        Memcached,
        Xdebug,
        Yaml
    ]

    /**
     * Get the path of the extension directory currently used by PECL.
     */
    static getExtensionDirectory = async (): Promise<string> => {
        const {stdout} = await execa('pecl', ['config-get', 'ext_dir'])
        let directory = stdout.replace('\n', '').trim()

        if (directory.indexOf('/Cellar/') !== -1)
            directory = directory.replace('/lib/php/', '/pecl/')

        return directory
    }

    /**
     * Install all extensions supported by Jale. Set optionals to true to also include optional extensions.
     *
     * @param optionals
     */
    static installExtensions = async (optionals: boolean = false) => {
        console.log('Installing PECL extensions')

        for (const extension of Pecl.PHP_EXTENSIONS) {
            const ext = new extension
            if (!optionals && !ext.default)
                continue

            await ext.install()
            await ext.enable()
        }
    }

    /**
     * Uninstall all extensions supported by Jale. Set optionals to true to also include optional extensions.
     *
     * @param optionals
     */
    static uninstallExtensions = async (optionals: boolean = false) => {
        console.log('Uninstalling PECL extensions')

        for (const extension of Pecl.PHP_EXTENSIONS) {
            const ext = new extension
            if (!optionals && !ext.default)
                continue

            await ext.uninstall()
            await ext.disable()
        }
    }
}

export default Pecl