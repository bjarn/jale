import PhpExtension from '../phpExtension'

class Xdebug extends PhpExtension {
    alias = 'xdebug'
    extension = 'xdebug'

    default = false
    extensionType = Xdebug.ZEND_EXTENSION_TYPE
}

export default Xdebug