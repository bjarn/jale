import commander from 'commander'
import SitesController from '../controllers/sitesController'
import UseController from '../controllers/useController'
import XdebugController from '../controllers/xdebugController'

export default function installCommand(program: typeof commander) {
    return program
        .command('xdebug <status>')
        .description('Enable or disable the xdebug PHP extension. Use \'on\' or \'off\'.')
        .action((status: string) => {
            (new XdebugController()).execute(status).catch(err => console.log(err.message))
        })
}