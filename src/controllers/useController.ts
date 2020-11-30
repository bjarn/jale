import {client} from '../utils/os'
import {getLinkedPhpVersion, getPhpFpmByName, supportedPhpVersions} from '../utils/phpFpm'

class UseController {

    /**
     * Switch the service to the given version.
     */
    execute = async (service: string, version: string): Promise<boolean> => {
        try {
            switch (service) {
                case 'php':
                    console.log(`Switching to PHP ${version}`)
                    await this.switchPhpVersionTo(version)
                    return true
                default:
                    console.log('Invalid service.')
                    return false
            }
        } catch (e) {
            throw new Error(e.message)
        }
    }

    /**
     * Switch the active PHP version to the provided phpVersion string.
     * @param phpVersion
     */
    switchPhpVersionTo = async (phpVersion: string): Promise<void> => {
        const currentPhpVersion = await getLinkedPhpVersion()

        if (!supportedPhpVersions.includes(phpVersion)) {
            throw Error(`Invalid PHP version. Please pick one of the following version: ${supportedPhpVersions.join(', ')}`)
        }

        const newPhpVersion = getPhpFpmByName(`php@${phpVersion}`)

        if (newPhpVersion.isEndOfLife) {
            console.warn('This PHP version is End Of Life. Be aware it might contain security flaws.')
            console.warn('Please check http://php.net/supported-versions.php for more information.')
        }

        // Make sure the PHP version is installed.
        if (await client().packageManager.packageIsInstalled(newPhpVersion.service)) {
            console.log(`Installing PHP ${newPhpVersion.versionName}`)
            await client().packageManager.install(newPhpVersion.service)
            console.log(`Configuring PHP ${newPhpVersion.versionName}`)
            await newPhpVersion.configure()
        }

        await currentPhpVersion.unLinkPhpVersion()

        // TODO: Relink some libs like libjpeg etc.

        await newPhpVersion.linkPhpVersion()

        await currentPhpVersion.stop()
        await newPhpVersion.start()

        console.log(`Successfully switched to PHP ${newPhpVersion.versionName}`)
    }

}

export default UseController