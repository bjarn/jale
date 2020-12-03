import {ZEND_EXTENSION_TYPE} from '../extensions'
import PhpExtension from '../phpExtension'

class Xdebug extends PhpExtension {
    alias = 'xdebug'
    extension = 'xdebug'

    default = false
    extensionType = ZEND_EXTENSION_TYPE
}

export default Xdebug