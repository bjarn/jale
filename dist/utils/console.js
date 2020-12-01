"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearConsole = void 0;
const readline = require('readline');
const clearConsole = () => {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
};
exports.clearConsole = clearConsole;
//# sourceMappingURL=console.js.map