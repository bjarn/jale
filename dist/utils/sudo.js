"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSudo = void 0;
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
function requireSudo() {
    return execa_1.default('sudo', ['-v']);
}
exports.requireSudo = requireSudo;
//# sourceMappingURL=sudo.js.map