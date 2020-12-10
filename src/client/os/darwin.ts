import Client from '../client'
import PackageManager from '../packageManager'
import Homebrew from '../packageManager/homebrew'
import ServiceCtl from '../serviceCtl'
import BrewServices from '../serviceCtl/brewServices'

class Darwin implements Client {

    operatingSystem = 'darwin'
    packageManager: PackageManager = new Homebrew
    serviceCtl: ServiceCtl = new BrewServices
    services = null

}

export default Darwin