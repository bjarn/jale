import {log} from '../src/utils/console'

describe('Console Utils', () => {
    let outputData = ''
    const storeLog = (inputs: string) => (outputData += inputs)

    test('Log to console', () => {
        console['log'] = jest.fn(storeLog)
        log('prefix ', 'body')
        expect(outputData).toBe('prefix body')
    })
})