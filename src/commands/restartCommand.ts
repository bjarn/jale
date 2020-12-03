import commander from 'commander'
import ServiceController from '../controllers/serviceController'

export default function restartCommand(program: typeof commander) {
    return program
        .command('restart [service]')
        .description('Restart all or a specific service.')
        .action((service: string | undefined) => {
            (new ServiceController()).executeRestart(service).catch(err => console.log(err.message))
        })
}