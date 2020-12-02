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
        new Apcu,
        new Geoip,
        new Memcached,
        new Xdebug,
        new Yaml
    ]

    /**
     * Get the path of the PHP ini currently used by PECL.
     */
    static getPhpIni = async (): Promise<string> => {
        const peclIni = await execa('pecl', ['config-get', 'php_ini'])
        const peclIniPath = peclIni.stdout.replace('\n', '')

        if (existsSync(peclIniPath))
            return peclIniPath

        const phpIni = await execa('php', ['-i', '|', 'grep', 'php.ini'])

        const matches = phpIni.stdout.match(/Path => ([^\s]*)/)

        if (!matches || matches.length <= 0)
            throw new Error('Unable to find php.ini.')

        return `${matches[1].trim()}/php.ini`
    }

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
            if (!optionals && !extension.default)
                continue

            await extension.install()
            await extension.enable()
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
            if (!optionals && !extension.default)
                continue

            await extension.uninstall()
            await extension.disable()
        }
    }
}

export default Pecl