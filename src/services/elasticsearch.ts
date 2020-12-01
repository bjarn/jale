import {writeFileSync} from 'fs'
import nginxElasticsearchConf from '../templates/nginxElasticsearch'
import redisConf from '../templates/redis'
import {client} from '../utils/os'
import {getConfig, sheepdogNginxAppsPath} from '../utils/sheepdog'
import Nginx from './nginx'
import Service from './service'

class Elasticsearch extends Service {
    requireRoot = false
    service = 'elasticsearch'

    // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
    configPath = `/usr/local/etc/elasticsearch/elasticsearch.yml`
    dataPath = `path.data`
    dataRootPath = `/usr/local/var`
    nginxConfigPath = `${sheepdogNginxAppsPath}/elasticsearch.conf`

    install = async (): Promise<boolean> => {
        try {
            await client().packageManager.install('java', true)
            await client().packageManager.install('homebrew/cask-versions/adoptopenjdk8', true)
            await client().packageManager.install('libyaml')
            await client().packageManager.install(this.service)

            return true
        } catch (e) {
            return false
        }
    }

    configure = async (): Promise<boolean> => {
        try {
            let config = await getConfig()
            await writeFileSync(this.nginxConfigPath, nginxElasticsearchConf(config.domain))
            await (new Nginx).restart()

            return true
        } catch (e) {
            throw e
        }
    }

}

export default Elasticsearch