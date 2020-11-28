import commander from 'commander'
import {yellow} from 'kleur'

export default function barkCommand(program: typeof commander) {
    return program
        .command('bark')
        .description('Make sheepdog bark')
        .action(() => {
            console.log(yellow('Ruff ruff'))
        })
}