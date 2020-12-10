import CustomTool from './customTool'

class Drush extends CustomTool {
    alias = 'drush'
    name = 'Drush'
    shasum = '97e64b94588eeca5f97ffcb0595c7e3988e685651d898d65c3ae07ca8f9c94c6'
    url = 'https://github.com/drush-ops/drush-launcher/releases/download/0.8.0/drush.phar'
}

export default Drush