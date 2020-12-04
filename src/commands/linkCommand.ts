import commander from 'commander'
import SitesController from '../controllers/sitesController'

export default (program: typeof commander): commander.Command => program
    .command('link')
    .option('-t, --type <type>', 'Provide a type for generating an optimized Nginx config. Supported: laravel, magento2, magento1.')
    .description('Create a new Nginx vhost config for your current project.')
    .action((options: commander.Command) => {
        (new SitesController()).executeLink(options.type).catch(err => console.log(err.message))
    })