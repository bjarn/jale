import PackageManager from '../packageManager'
import Homebrew from '../packageManager/homebrew'

class Darwin implements Client {

    operatingSystem: string = "darwin"
    packageManager: PackageManager = new Homebrew
    services: any = null

}

export default Darwin