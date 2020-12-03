"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("./app"));
class WpCli extends app_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'wp-cli';
        this.name = 'Wordpress CLI';
    }
}
//# sourceMappingURL=wpCli.js.map