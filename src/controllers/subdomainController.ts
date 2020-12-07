import Nginx from '../services/nginx'
import {ensureDirectoryExists} from '../utils/filesystem'
import {jaleSitesPath} from '../utils/jale'

class SubdomainController {

    appTypes = ['laravel', 'magento2', 'magento1']

    execute = async (option: string, subdomain: string): Promise<void> => {
        if (option !== 'add' && option !== 'del') {
            console.log('Invalid option. Please use \'add\' or \'del\', followed by the subdomain.')
            return
        }
        await ensureDirectoryExists(jaleSitesPath)

        await (new Nginx()).reload()
    }


}

export default SubdomainController