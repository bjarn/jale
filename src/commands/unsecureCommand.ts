import commander from 'commander'
import SecureController from '../controllers/secureController'

export default (program: typeof commander): commander.Command => program
    .command('unsecure')
    .description('Unsecure a site and remove its self-signed certificate.')
    .action(() => {
        (new SecureController()).executeUnsecure().catch(err => console.log(err.message))
    })