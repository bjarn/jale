import * as fs from 'fs'
import OS from '../client/OS'
import PhpFpm from '../services/phpFpm'
import PhpFpm72 from '../services/phpFpm72'
import PhpFpm73 from '../services/phpFpm73'
import PhpFpm74 from '../services/phpFpm74'
import PhpFpm80 from '../services/phpFpm80'
import PhpFpm81 from '../services/phpFpm81'

const supportedPhpVersions: string[] = [
    (new PhpFpm81).versionName,
    (new PhpFpm80).versionName,
    (new PhpFpm74).versionName,
    (new PhpFpm73).versionName,
    (new PhpFpm72).versionName,
]

const getPhpFpmByName = (phpVersion: string): PhpFpm => {
    let phpService: PhpFpm

    switch (phpVersion) {
    case (new PhpFpm72).service:
        phpService = new PhpFpm72()
        break
    case (new PhpFpm73).service:
        phpService = new PhpFpm73()
        break
    case (new PhpFpm74).service:
        phpService = new PhpFpm74()
        break
    case `${(new PhpFpm80).service}`:
        phpService = new PhpFpm80()
        break
    case `${(new PhpFpm81).service}@8.1`: // TODO: When PHP 8.2 is out, remove the hardcoded version.
        phpService = new PhpFpm81()
        break
    default:
        throw Error('Invalid PHP version: ' + phpVersion)
    }

    return phpService
}

/**
 * Get the currently linked Php Fpm binary.
 */
const getLinkedPhpVersion = async (): Promise<PhpFpm> => {
    const phpLink = await fs.lstatSync(`${OS.getInstance().usrLocalDir}/bin/php`)

    if (!phpLink.isSymbolicLink()) {
        throw Error('Php executable is not found.')
    }

    const phpBinary = await fs.realpathSync(`${OS.getInstance().usrLocalDir}/bin/php`)

    let linkedPhpVersion: PhpFpm | undefined

    supportedPhpVersions.forEach((versionName) => {
        if (phpBinary.includes(versionName)) {
            linkedPhpVersion = getPhpFpmByName(`php@${versionName}`)
        }
    })

    if (linkedPhpVersion) {
        return linkedPhpVersion
    } else {
        throw Error('Unable to determine linked PHP version')
    }
}

export {
    supportedPhpVersions,
    getPhpFpmByName,
    getLinkedPhpVersion
}
