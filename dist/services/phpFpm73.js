"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phpFpm_1 = tslib_1.__importDefault(require("./phpFpm"));
class PhpFpm73 extends phpFpm_1.default {
    constructor() {
        super(...arguments);
        this.isEndOfLife = false;
        this.versionName = '7.3';
        this.service = `php@${this.versionName}`;
        this.configPath = `${this.configRootPath}/7.3/php-fpm.d/www.conf`;
        this.iniDirectoryPath = `${this.configRootPath}/7.3/conf.d`;
    }
}
exports.default = PhpFpm73;
//# sourceMappingURL=phpFpm73.js.map