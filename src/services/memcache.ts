import Service from './service'

class Memcache extends Service {
    requireRoot = false
    service = 'libmemcached'

    configure(): Promise<boolean> {
        return Promise.resolve(false)
    }

}

export default Memcache