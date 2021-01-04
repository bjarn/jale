import {writeFileSync} from 'fs'
import nginxElasticsearchConf from '../templates/nginx/elasticsearch'
import {client} from '../utils/os'
import {getConfig, jaleNginxAppsPath} from '../utils/jale'
import Nginx from './nginx'
import Service from './service'

class Elasticsearch extends Service {
    requireRoot = false
    service = 'elasticsearch'

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = '/usr/local/etc/elasticsearch/elasticsearch.yml'
    dataPath = 'path.data'
    dataRootPath = '/usr/local/var'
    nginxConfigPath = `${jaleNginxAppsPath}/elasticsearch.conf`

    install = async (): Promise<boolean> => {
        await client().packageManager.install('homebrew/cask-versions/adoptopenjdk8', true)
        await client().packageManager.install('libyaml', false)
        await client().packageManager.install(this.service, false)

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