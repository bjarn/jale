import kleur from 'kleur'
import {info, log, success, verbose, warning, url, emptyLine, error, clearConsole} from '../src/utils/console'

describe('Console Utils', () => {
    let outputData = ''
    const storeLog = (inputs: string) => (outputData += inputs)

    test('Log to console', () => {
        console['log'] = jest.fn(storeLog)
        log('prefix ', 'body')
        expect(outputData).toBe('prefix body')

        outputData = ''
    })

    test('Verbose log', () => {
        console['log'] = jest.fn(storeLog)
        verbose('verbose message')
        expect(outputData).toBe(kleur.gray(kleur.bold('🛠  ')) + kleur.gray('verbose message'))

        outputData = ''
    })

    test('Info log', () => {
        console['log'] = jest.fn(storeLog)
        info('info message')
        expect(outputData).toBe(kleur.gray(kleur.bold('✨  ')) + kleur.white('info message'))

        outputData = ''
    })

    test('Success log', () => {
        console['log'] = jest.fn(storeLog)
        success('success message')
        expect(outputData).toBe(kleur.gray(kleur.bold('\n✅ ')) + kleur.white('success message'))

        outputData = ''
    })

    test('Warning log', () => {
        console['log'] = jest.fn(storeLog)
        warning('warning message')
        expect(outputData).toBe(kleur.yellow(kleur.bold('⚠️  Warning: ')) + kleur.yellow('warning message'))

        outputData = ''
    })

    test('Error log', () => {
        console['log'] = jest.fn(storeLog)
        error('error message')
        expect(outputData).toBe(kleur.red(kleur.bold('\n🚨 Error: ')) + kleur.red('error message'))

        outputData = ''
    })

    test('URL formatting', () => {
        const result = url('https://github.com/bjarn/jale')
        expect(result).toBe(kleur.bold(kleur.underline('https://github.com/bjarn/jale')))
    })

    test('Empty line log', () => {
        console['log'] = jest.fn(storeLog)
        emptyLine()
        expect(outputData).toBe('')

        outputData = ''
    })

    test('Clear console', () => {
        console['log'] = jest.fn(storeLog)
        process.stdout.rows = 10
        const expectedLines = '\n'.repeat(10)
        clearConsole()
        expect(outputData).toBe(expectedLines)

        outputData = ''
    })
})