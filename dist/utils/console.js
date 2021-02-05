"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearConsole = exports.emptyLine = exports.url = exports.error = exports.warning = exports.success = exports.info = exports.verbose = void 0;
const tslib_1 = require("tslib");
const kleur_1 = tslib_1.__importDefault(require("kleur"));
const readline = tslib_1.__importStar(require("readline"));
const prefix = {
    verbose: kleur_1.default.gray(kleur_1.default.bold('🛠  ')),
    info: kleur_1.default.gray(kleur_1.default.bold('✨  ')),
    success: kleur_1.default.gray(kleur_1.default.bold('✅ ')),
    warning: kleur_1.default.yellow(kleur_1.default.bold('⚠️  Warning: ')),
    error: kleur_1.default.red(kleur_1.default.bold('🚨 Error: ')),
};
const body = {
    default: kleur_1.default.white,
    verbose: kleur_1.default.gray,
    warning: kleur_1.default.yellow,
    error: kleur_1.default.red
};
const log = (prefix, body) => {
    let out = prefix;
    out = out.concat(body);
    console.log(out);
};
const verbose = (message) => {
    log(prefix.verbose, body.verbose(message));
};
exports.verbose = verbose;
const info = (message) => {
    log(prefix.info, body.default(message));
};
exports.info = info;
const warning = (message) => {
    log(prefix.warning, body.warning(message));
};
exports.warning = warning;
const error = (message) => {
    log(prefix.error, body.error(message));
};
exports.error = error;
const success = (message) => {
    log(prefix.success, body.default(message));
};
exports.success = success;
const url = (url) => {
    return kleur_1.default.bold(kleur_1.default.underline(url));
};
exports.url = url;
const emptyLine = () => {
    console.log('');
};
exports.emptyLine = emptyLine;
const clearConsole = () => {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
};
exports.clearConsole = clearConsole;
//# sourceMappingURL=console.js.map