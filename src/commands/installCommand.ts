import commander from 'commander'
import InstallController from '../controllers/installController'

export default function installCommand(program: typeof commander) {
    return program
        .command('install')
        .description('Run the initial setup of Jale')
        .action(() => {
            (new InstallController()).execute().catch(err => console.log(err.message))
        })
}