import * as fs from 'fs'
import PhpFpm from '../services/phpFpm'
import PhpFpm72 from '../services/phpFpm72'
import PhpFpm73 from '../services/phpFpm73'
import PhpFpm74 from '../services/phpFpm74'
import PhpFpm80 from '../services/phpFpm80'

const supportedPhpVersions = new Map([
    [(new PhpFpm80).versionName, `${(new PhpFpm80).formulaName}${(new PhpFpm80).versionName}`],
    [(new PhpFpm74).versionName, `${(new PhpFpm74).formulaName}${(new PhpFpm74).versionName}`],
    [(new PhpFpm73).versionName, `${(new PhpFpm73).formulaName}${(new PhpFpm73).versionName}`],
    [(new PhpFpm72).versionName, `${(new PhpFpm72).formulaName}${(new PhpFpm72).versionName}`],
])

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
        case (new PhpFpm80).service:
            phpService = new PhpFpm80()
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
    const phpLink = await fs.lstatSync('/usr/local/bin/php')

    if (phpLink.isSymbolicLink()) {
        throw Error('Php executable is not found.')
    }

    const phpBinary = await fs.realpathSync('/usr/local/bin/php')

    supportedPhpVersions.forEach((versionName, formulaName) => {
        if (phpBinary.includes(versionName)) {
            return getPhpFpmByName(`${formulaName}${versionName}`)
        }
    })

    throw Error('Unable to determine linked Php version')
}

export {
    supportedPhpVersions,
    getPhpFpmByName,
    getLinkedPhpVersion
}