import commander from 'commander'
import UseController from '../controllers/useController'

export default function useCommand(program: typeof commander) {
    return program
        .command('use <service> <version>')
        .description('Switch a version of a specific service, i.e. use PHP 7.4 instead of 7.2.')
        .action((service: string, version: string) => {
            (new UseController()).execute(service, version).catch(err => console.log(err.message))
        })
}