import execa from 'execa'
import * as fs from 'fs'
import {chmodSync, existsSync, unlinkSync} from 'fs'
import * as http from 'http'
import App from './app'

abstract class CustomApp extends App {

    abstract name: string
    abstract alias: string

    abstract url: string
    abstract shasum: string

    binLocation: string = '/usr/local/bin'

    /**
     * Install the binary.
     */
    install = async (): Promise<boolean> => {
        const fileName = this.url.substring(this.url.lastIndexOf('/') + 1)
        const file = fs.createWriteStream(`/tmp/${fileName}`)

        console.log(`Downloading binary for ${this.name}...`)

        const res = await http.get(this.url)
        await res.pipe(file)

        if (!(await this.isValidShasum(`/tmp/${fileName}`))) {
            console.log(`Unable to install ${this.name}. The checksum ${this.shasum} is not equal to the one of the downloaded file.`)
            await unlinkSync(`/tmp/${fileName}`)
            return false
        }

        await fs.copyFileSync(`/tmp/${fileName}`, `${this.binLocation}/${this.alias}`)
        await chmodSync(`${this.binLocation}/${this.alias}`, 0o777)

        console.log(`Successfully installed ${this.name}`)

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

        try {
            await unlinkSync(`${this.binLocation}/${this.alias}`)
        } catch (e) {
            throw new Error(`Unable to uninstall ${this.name}. Please remove the file manually to continue:\nrm${this.binLocation}/${this.alias}`)
        }

        console.log(`Uninstalled ${this.name}`)

        return true
    }

    /**
     * Check if the binary of the app exists.
     */
    isInstalled = async (): Promise<boolean> => {
        return existsSync(`${this.binLocation}/${this.alias}`)
    }

    /**
     * Check if the file has a valid shasum.
     *
     * @param path
     */
    isValidShasum = async (path: string): Promise<boolean> => {
        const {stdout} = await execa('shasum', ['-a256', path])
        const shasum = stdout.replace(path, '').trim()

        return shasum === this.shasum
    }

}

export default CustomApp