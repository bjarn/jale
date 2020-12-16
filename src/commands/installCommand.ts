import commander from 'commander'
import InstallController from '../controllers/installController'
import {error} from '../utils/console'

export default (program: typeof commander): commander.Command => program
    .command('install')
    .description('Run the initial setup of Jale')
    .action(() => {
        (new InstallController()).execute().catch(err => error(err.message))
    })