import commander from 'commander'
import SecureController from '../controllers/secureController'

export default (program: typeof commander): commander.Command => program
    .command('secure')
    .description('Secure a site with a self-signed SSL.')
    .action(() => {
        (new SecureController()).executeSecure().catch(err => console.log(err.message))
    })