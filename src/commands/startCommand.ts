import commander from 'commander'
import ServiceController from '../controllers/serviceController'

export default function installCommand(program: typeof commander) {
    return program
        .command('start [service]')
        .description('Start all or a specific service.')
        .action((service: string | undefined) => {
            (new ServiceController()).executeStart(service).catch(err => console.log(err.message))
        })
}