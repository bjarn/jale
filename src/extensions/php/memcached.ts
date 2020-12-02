import PhpExtension from '../phpExtension'

class Memcached extends PhpExtension {
    alias = 'memcached'
    extension = 'memcached'

    default = false
}

export default Memcached