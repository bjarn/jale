"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("../src/utils/console");
describe('Console Utils', () => {
    let outputData = '';
    const storeLog = (inputs) => (outputData += inputs);
    test('Log to console', () => {
        console['log'] = jest.fn(storeLog);
        console_1.log('prefix ', 'body');
        expect(outputData).toBe('prefix body');
    });
});
//# sourceMappingURL=console.spec.js.map