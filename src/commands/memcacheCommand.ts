import commander from 'commander'
import MemcacheController from '../controllers/memcacheController'

export default (program: typeof commander): commander.Command => program
    .command('memcache <status>')
    .description('Enable or disable Memcache. Use \'on\' or \'off\'.')
    .action((status: string) => {
        (new MemcacheController()).execute(status).catch(err => console.log(err.message))
    })