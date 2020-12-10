import commander from 'commander'
import SecureController from '../controllers/secureController'

export default (program: typeof commander): commander.Command => program
    .command('secure [status]')
    .description('Create a self-signed SSL certificate for your site.')
    .action((status: string | undefined) => {
        (new SecureController()).execute(status).catch(err => console.log(err.message))
    })