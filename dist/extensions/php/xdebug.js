"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const extensions_1 = require("../extensions");
const phpExtension_1 = tslib_1.__importDefault(require("../phpExtension"));
class Xdebug extends phpExtension_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'xdebug';
        this.extension = 'xdebug';
        this.default = false;
        this.extensionType = extensions_1.ZEND_EXTENSION_TYPE;
    }
}
exports.default = Xdebug;
//# sourceMappingURL=xdebug.js.map