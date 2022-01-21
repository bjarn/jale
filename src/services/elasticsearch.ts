import {writeFileSync} from 'fs'
import OS from '../client/OS'
import nginxElasticsearchConf from '../templates/nginx/elasticsearch'
import {getConfig, jaleNginxAppsPath} from '../utils/jale'
import Nginx from './nginx'
import Service from './service'

class Elasticsearch extends Service {
    requireRoot = false
    service = 'elasticsearch'


    configPath = `${OS.getInstance().usrLocalDir}/etc/elasticsearch/elasticsearch.yml`
    dataPath = 'path.data'
    dataRootPath = `${OS.getInstance().usrLocalDir}/var`
    nginxConfigPath = `${jaleNginxAppsPath}/elasticsearch.conf`

    install = async (): Promise<boolean> => {
        await OS.getInstance().packageManager.install('homebrew/cask-versions/adoptopenjdk8', true)
        await OS.getInstance().packageManager.install('libyaml', false)
        await OS.getInstance().packageManager.install(this.service, false)

        return true
    }

    configure = async (): Promise<boolean> => {
        const config = await getConfig()
        await writeFileSync(this.nginxConfigPath, nginxElasticsearchConf(config.tld))
        await (new Nginx).restart()

        return true
    }

}

export default Elasticsearch
