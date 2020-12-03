import commander from 'commander'
import MemcacheController from '../controllers/memcacheController'

export default function memcacheCommand(program: typeof commander) {
    return program
        .command('memcache <status>')
        .description('Enable or disable Memcache. Use \'on\' or \'off\'.')
        .action((status: string) => {
            (new MemcacheController()).execute(status).catch(err => console.log(err.message))
        })
}