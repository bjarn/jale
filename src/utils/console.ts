import kleur from 'kleur'
import * as readline from 'readline'

const prefix = {
    verbose: kleur.gray(kleur.bold('\n🛠  ')),
    info: kleur.gray(kleur.bold('\n✨  ')),
    success: kleur.gray(kleur.bold('\n✅ ')),
    warning: kleur.yellow(kleur.bold('\n⚠️  Warning: ')),
    error: kleur.red(kleur.bold('\n🚨 Error: ')),
}

const body = {
    default: kleur.white,
    verbose: kleur.gray,
    warning: kleur.yellow,
    error: kleur.red
}

const log = (prefix: string, body: string) => {
    let out = prefix
    out = out.concat(body)
    out = out.concat('\n')

    console.log(out)
}

const verbose = (message: string) => {
    log(prefix.verbose, body.verbose(message))
}

const info = (message: string) => {
    log(prefix.info, body.default(message))
}

const warning = (message: string) => {
    log(prefix.warning, body.warning(message))
}

const error = (message: string) => {
    log(prefix.error, body.error(message))
}

const success = (message: string) => {
    log(prefix.success, body.default(message))
}

const url = (url: string) => {
    console.log(kleur.bold(kleur.underline(url)))
}

const emptyLine = () => {
    console.log('')
}

const clearConsole = () => {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
}

export {
    verbose,
    info,
    success,
    warning,
    error,
    url,
    emptyLine,
    clearConsole
}