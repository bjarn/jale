import Elasticsearch from '../services/elasticsearch'
import Redis from '../services/redis'
import Service from '../services/service'

const getOptionalServiceByname = (serviceName: string): Service => {
    let service: Service

    switch (serviceName) {
        case (new Redis).service:
            service = new Redis()
            break
        case (new Elasticsearch).service:
            service = new Elasticsearch()
            break
        default:
            throw Error('Invalid service: ' + serviceName)
    }

    return service
}

export {
    getOptionalServiceByname
}