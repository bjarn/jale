"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phpFpm_1 = tslib_1.__importDefault(require("./phpFpm"));
class PhpFpm74 extends phpFpm_1.default {
    constructor() {
        super(...arguments);
        this.isEndOfLife = false;
        this.versionName = '7.4';
        this.service = `php@${this.versionName}`;
        this.configPath = `${this.configRootPath}/7.4/php-fpm.d/www.conf`;
        this.iniDirectoryPath = `${this.configRootPath}/7.4/conf.d`;
    }
}
exports.default = PhpFpm74;
//# sourceMappingURL=phpFpm74.js.map