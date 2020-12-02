import execa from 'execa'
import * as fs from 'fs'
import Pecl from './pecl'

abstract class PhpExtension {
    static NORMAL_EXTENSION_TYPE = 'extension'
    static ZEND_EXTENSION_TYPE = 'zend_extension'

    abstract extension: string
    abstract alias: string

    // Extension settings
    default: boolean = true
    extensionType: string = PhpExtension.NORMAL_EXTENSION_TYPE

    /**
     * Check if the extension is enabled.
     */
    isEnabled = async (): Promise<boolean> => {
        const {stdout} = await execa('php', ['-m', '|', 'grep', this.extension])
        const extensions = stdout.split('\n')

        return extensions.includes(this.extension)
    }

    /**
     * Check if the extension is installed.
     */
    isInstalled = async (): Promise<boolean> => {
        const {stdout} = await execa('pecl', ['list', '|', 'grep', this.extension])
        return stdout.includes(this.extension)
    }

    /**
     * Install the extension.
     */
    install = async (): Promise<void> => {
        if (await this.isInstalled()) {
            console.log(`Extension ${this.extension} is already installed.`)
            return
        }

        const {stdout} = await execa('pecl', ['install', this.extension])

        const installRegex = new RegExp(`/Installing '(.*${this.alias}.so)'/`)
        // @ts-ignore
        if (installRegex.exec(stdout).length < 1)
            throw new Error(`Unable to find installation path for ${this.extension}. Result:\n\n${stdout}`)

        if (stdout.includes('Error:'))
            throw new Error(`Found installation path, but installation still failed: \n\n${stdout}`)

        const phpIniPath = await Pecl.getPhpIni()
        let phpIni = await fs.readFileSync(phpIniPath, 'utf-8')

        const extensionRegex = new RegExp(`/(zend_extension|extension)="(.*${this.alias}.so)"/`)
        // @ts-ignore
        if (extensionRegex.exec(phpIni).length < 1)
            throw new Error(`Unable to find definition in ${phpIniPath} for ${this.extension}`)

        console.log(`Extension ${this.extension} has been installed.`)
    }

    /**
     * Uninstall the extension.
     */
    uninstall = async (): Promise<void> => {
        await execa('pecl', ['uninstall', this.extension])
    }

    /**
     * Enable the extension.
     */
    enable = async (): Promise<void> => {
        if (await this.isEnabled()) {
            console.log(`Extension ${this.extension} is already enabled.`)
        }

        const phpIniPath = await Pecl.getPhpIni()
        let phpIni = await fs.readFileSync(phpIniPath, 'utf-8')
        const regex = new RegExp(`/(zend_extension|extension)="(.*${this.alias}.so)"\/n/`);
        phpIni = phpIni.replace(regex, '')
        phpIni = `${this.extensionType}="${this.alias}.so"\n${phpIni}`

        await fs.writeFileSync(phpIniPath, phpIni)

        console.log(`Extension ${this.extension} has been enabled`);
    }

    /**
     * Disable the extension.
     */
    disable = async (): Promise<void> => {
        const phpIniPath = await Pecl.getPhpIni()
        let phpIni = await fs.readFileSync(phpIniPath, 'utf-8')

        const regex = new RegExp(`/;?(zend_extension|extension)=".*${this.alias}.so"/`)
        phpIni = phpIni.replace(regex, '')

        await fs.writeFileSync(phpIniPath, phpIni)

        console.log(`Extension ${this.extension} has been disabled`)
    }
}

export default PhpExtension