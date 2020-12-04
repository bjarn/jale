import commander from 'commander'
import SitesController from '../controllers/sitesController'

export default (program: typeof commander): commander.Command => program
    .command('link')
    .description('Create a new Nginx vhost config for your current project.')
    .action(() => {
        (new SitesController()).executeLink().catch(err => console.log(err.message))
    })