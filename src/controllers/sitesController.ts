import {writeFileSync} from 'fs'
import Nginx from '../services/nginx'
import nginxSiteConfig from '../templates/nginxSite'
import {ensureDirectoryExists} from '../utils/filesystem'
import {getConfig, jaleSitesPath} from '../utils/jale'

class SitesController {

    executeLink = async (): Promise<void> => {
        const config = await getConfig()
        const domain = process.cwd().substring(process.cwd().lastIndexOf('/') + 1)
        const hostname = `${domain}.${config.domain}`

        await ensureDirectoryExists(jaleSitesPath)

        await writeFileSync(`${jaleSitesPath}/${hostname}.conf`, nginxSiteConfig(hostname, process.cwd()))

        await (new Nginx()).reload
    }

}

export default SitesController