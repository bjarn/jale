import commander from 'commander'
import ServiceController from '../controllers/serviceController'

export default function installCommand(program: typeof commander) {
    return program
        .command('stop [service]')
        .description('Stop all or a specific service.')
        .action((service: string | undefined) => {
            (new ServiceController()).executeStop(service).catch(err => console.log(err.message))
        })
}