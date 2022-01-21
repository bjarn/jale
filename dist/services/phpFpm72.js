"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phpFpm_1 = tslib_1.__importDefault(require("./phpFpm"));
class PhpFpm72 extends phpFpm_1.default {
    constructor() {
        super(...arguments);
        this.isEndOfLife = true;
        this.versionName = '7.2';
        this.service = `php@${this.versionName}`;
        this.configPath = `${this.configRootPath}/7.2/php-fpm.d/www.conf`;
        this.iniDirectoryPath = `${this.configRootPath}/7.2/conf.d`;
    }
}
exports.default = PhpFpm72;
//# sourceMappingURL=phpFpm72.js.map