import commander from 'commander'
import ServiceController from '../controllers/serviceController'
import {error} from '../utils/console'

export default (program: typeof commander): commander.Command => program
    .command('start [service]')
    .description('Start all or a specific service.')
    .action((service: string | undefined) => {
        (new ServiceController()).executeStart(service).catch(err => error(err.message))
    })