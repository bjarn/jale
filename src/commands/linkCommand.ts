import commander from 'commander'
import SitesController from '../controllers/sitesController'
import {error} from '../utils/console'

export default (program: typeof commander): commander.Command => program
    .command('link [name]')
    .option('-t, --type <type>', 'Provide a type for generating an optimized Nginx config. Supported: laravel, magento2, magento1.')
    .description('Create a new Nginx vhost config for your current project.')
    .action((name: string, options: commander.Command) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (new SitesController()).executeLink(options.type, name).catch(err => error(err.message))
    })