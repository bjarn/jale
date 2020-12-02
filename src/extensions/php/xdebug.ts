import PhpExtension from '../phpExtension'

class Xdebug extends PhpExtension {
    alias = 'xdebug'
    extension = 'xdebug'

    defaulft = false
    extensionType = PhpExtension.ZEND_EXTENSION_TYPE
}

export default Xdebug