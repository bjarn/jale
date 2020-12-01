"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phpFpm_1 = tslib_1.__importDefault(require("./phpFpm"));
class PhpFpm80 extends phpFpm_1.default {
    constructor() {
        super(...arguments);
        this.isEndOfLife = false;
        this.versionName = '8.0';
        this.service = `php@${this.versionName}`;
        // TODO: These paths should be using the Client class. Otherwise they won't work cross platform.
        this.configPath = `${this.configRootPath}/8.0/php-fpm.d/www.conf`;
        this.iniDirectoryPath = `${this.configRootPath}/8.0/conf.d`;
    }
}
exports.default = PhpFpm80;
//# sourceMappingURL=phpFpm80.js.map