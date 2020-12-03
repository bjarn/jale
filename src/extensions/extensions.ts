import Apcu from './php/apcu'
import Geoip from './php/geoip'
import Memcached from './php/memcached'
import Xdebug from './php/xdebug'
import Yaml from './php/yaml'

const NORMAL_EXTENSION_TYPE = 'extension'
const ZEND_EXTENSION_TYPE = 'zend_extension'

/**
 * All extensions available in Jale.
 */
const PHP_EXTENSIONS = [
    Apcu,
    Geoip,
    Memcached,
    Xdebug,
    Yaml
]

export {
    NORMAL_EXTENSION_TYPE,
    ZEND_EXTENSION_TYPE,
    PHP_EXTENSIONS
}