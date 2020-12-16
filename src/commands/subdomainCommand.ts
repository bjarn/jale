import commander from 'commander'
import SubdomainController from '../controllers/subdomainController'
import {error} from '../utils/console'

export default (program: typeof commander): commander.Command => program
    .command('subdomain <option> <subdomain>')
    .description('Add or remove a subdomain to the current project.')
    .action((option: string, subdomain: string) => {
        (new SubdomainController()).execute(option, subdomain).catch(err => error(err.message))
    })