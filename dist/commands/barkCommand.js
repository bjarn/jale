"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kleur_1 = require("kleur");
function barkCommand(program) {
    return program
        .command('bark')
        .description('Make sheepdog bark')
        .action(() => {
        console.log(kleur_1.yellow('Ruff ruff'));
    });
}
exports.default = barkCommand;
//# sourceMappingURL=barkCommand.js.map