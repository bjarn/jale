import {writeFileSync} from 'fs'
import OS from '../client/OS'
import redisConf from '../templates/redis'
import Service from './service'

class Redis extends Service {
    requireRoot = false
    service = 'redis'


    configPath = `${OS.getInstance().usrLocalDir}/etc/redis.conf`

    configure = async (): Promise<boolean> => {
        await writeFileSync(this.configPath, redisConf)
        return true
    }

}

export default Redis
