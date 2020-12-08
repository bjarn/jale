import commander from 'commander'
import SubdomainController from '../controllers/subdomainController'

export default (program: typeof commander): commander.Command => program
    .command('subdomain <option> <subdomain>')
    .description('Add or remove a subdomain to the current project.')
    .action((option: string, subdomain: string) => {
        (new SubdomainController()).execute(option, subdomain).catch(err => console.log(err.message))
    })