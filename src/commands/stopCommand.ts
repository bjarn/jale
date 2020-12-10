import commander from 'commander'
import ServiceController from '../controllers/serviceController'

export default (program: typeof commander): commander.Command => program
    .command('stop [service]')
    .description('Stop all or a specific service.')
    .action((service: string | undefined) => {
        (new ServiceController()).executeStop(service).catch(err => console.log(err.message))
    })