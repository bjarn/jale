import commander from 'commander'
import SitesController from '../controllers/sitesController'
import { error } from '../utils/console'

export default (program: typeof commander): commander.Command => program
    .command('links')
    .description('List all Nginx vhost configurations')
    .action(() => {
        (new SitesController()).listLinks().catch(err => error(err.message))
    })
