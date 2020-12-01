"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mysql_1 = tslib_1.__importDefault(require("./mysql"));
class Mysql80 extends mysql_1.default {
    constructor() {
        super(...arguments);
        this.versionName = '8.0';
        this.service = `mysql@${this.versionName}`;
    }
}
exports.default = Mysql80;
//# sourceMappingURL=mysql80.js.map