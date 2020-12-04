import commander from 'commander'
import InstallController from '../controllers/installController'

export default (program: typeof commander): commander.Command => program
    .command('install')
    .description('Run the initial setup of Jale')
    .action(() => {
        (new InstallController()).execute().catch(err => console.log(err.message))
    })