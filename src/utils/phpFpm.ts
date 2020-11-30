import PhpFpm from '../services/phpFpm'
import PhpFpm72 from '../services/phpFpm72'
import PhpFpm73 from '../services/phpFpm73'
import PhpFpm74 from '../services/phpFpm74'
import PhpFpm80 from '../services/phpFpm80'


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

export {
    getPhpFpmByName
}