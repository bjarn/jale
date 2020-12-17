"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur_1 = tslib_1.__importDefault(require("kleur"));
const console_1 = require("../src/utils/console");
describe('Console Utils', () => {
    let outputData = '';
    const storeLog = (inputs) => (outputData += inputs);
    test('Log to console', () => {
        console['log'] = jest.fn(storeLog);
        console_1.log('prefix ', 'body');
        expect(outputData).toBe('prefix body');
        outputData = '';
    });
    test('Verbose log', () => {
        console['log'] = jest.fn(storeLog);
        console_1.verbose('verbose message');
        expect(outputData).toBe(kleur_1.default.gray(kleur_1.default.bold('🛠  ')) + kleur_1.default.gray('verbose message'));
        outputData = '';
    });
    test('Info log', () => {
        console['log'] = jest.fn(storeLog);
        console_1.info('info message');
        expect(outputData).toBe(kleur_1.default.gray(kleur_1.default.bold('✨  ')) + kleur_1.default.white('info message'));
        outputData = '';
    });
    test('Success log', () => {
        console['log'] = jest.fn(storeLog);
        console_1.success('success message');
        expect(outputData).toBe(kleur_1.default.gray(kleur_1.default.bold('\n✅ ')) + kleur_1.default.white('success message'));
        outputData = '';
    });
    test('Warning log', () => {
        console['log'] = jest.fn(storeLog);
        console_1.warning('warning message');
        expect(outputData).toBe(kleur_1.default.yellow(kleur_1.default.bold('⚠️  Warning: ')) + kleur_1.default.yellow('warning message'));
        outputData = '';
    });
    test('Error log', () => {
        console['log'] = jest.fn(storeLog);
        console_1.error('error message');
        expect(outputData).toBe(kleur_1.default.red(kleur_1.default.bold('\n🚨 Error: ')) + kleur_1.default.red('error message'));
        outputData = '';
    });
    test('URL formatting', () => {
        const result = console_1.url('https://github.com/bjarn/jale');
        expect(result).toBe(kleur_1.default.bold(kleur_1.default.underline('https://github.com/bjarn/jale')));
    });
    test('Empty line log', () => {
        console['log'] = jest.fn(storeLog);
        console_1.emptyLine();
        expect(outputData).toBe('');
        outputData = '';
    });
    test('Clear console', () => {
        console['log'] = jest.fn(storeLog);
        process.stdout.rows = 10;
        const expectedLines = '\n'.repeat(10);
        console_1.clearConsole();
        expect(outputData).toBe(expectedLines);
        outputData = '';
    });
});
//# sourceMappingURL=console.spec.js.map