import commander from 'commander'
import SitesController from '../controllers/sitesController'
import {error} from '../utils/console'

export default (program: typeof commander): commander.Command => program
    .command('unlink')
    .description('Remove the Nginx vhost configuration for your current project.')
    .action(() => {
        (new SitesController()).executeUnlink().catch(err => error(err.message))
    })