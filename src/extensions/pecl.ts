import execa from 'execa'
import {existsSync} from 'fs'
import {PHP_EXTENSIONS} from './extensions'

class Pecl {
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

        for (const extension of PHP_EXTENSIONS) {
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

        for (const extension of PHP_EXTENSIONS) {
            const ext = new extension
            if (!optionals && !ext.default)
                continue

            await ext.uninstall()
            await ext.disable()
        }
    }
}

export default Pecl