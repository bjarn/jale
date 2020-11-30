"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mysql_1 = tslib_1.__importDefault(require("./mysql"));
class Mariadb extends mysql_1.default {
    constructor() {
        super(...arguments);
        this.versionName = '';
        this.service = `mariadb`;
    }
}
exports.default = Mariadb;
//# sourceMappingURL=mariadb.js.map