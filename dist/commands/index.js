"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
function default_1(program) {
    const commands = {};
    const loadPath = path_1.default.dirname(__filename);
    // Loop through command files
    fs_1.default.readdirSync(loadPath).filter(function (filename) {
        return (/\.js$/.test(filename) && filename !== 'index.js');
    }).forEach(function (filename) {
        let name = filename.substr(0, filename.lastIndexOf('.'));
        // Require command
        let command = require(path_1.default.join(loadPath, filename));
        // Initialize command
        commands[name] = command.default(program);
    });
    return commands;
}
exports.default = default_1;
//# sourceMappingURL=index.js.map