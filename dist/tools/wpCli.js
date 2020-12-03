"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tool_1 = tslib_1.__importDefault(require("./tool"));
class WpCli extends tool_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'wp-cli';
        this.name = 'Wordpress CLI';
    }
}
exports.default = WpCli;
//# sourceMappingURL=wpCli.js.map