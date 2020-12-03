import CustomTool from './customTool'

class Drush extends CustomTool {
    alias: string = 'drush'
    name: string = 'Drush'
    shasum: string = '97e64b94588eeca5f97ffcb0595c7e3988e685651d898d65c3ae07ca8f9c94c6'
    url: string = 'https://github.com/drush-ops/drush-launcher/releases/download/0.8.0/drush.phar'
}

export default Drush