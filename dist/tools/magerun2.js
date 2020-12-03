"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const customTool_1 = tslib_1.__importDefault(require("./customTool"));
class Magerun2 extends customTool_1.default {
    constructor() {
        super(...arguments);
        this.alias = 'magerun2';
        this.name = 'N98-Magerun 2';
        this.shasum = 'b7e229e1a91b844d6aac900642cfea63625c1784de10fee4e186a5ca465bff9c';
        this.url = 'https://files.magerun.net/n98-magerun2-4.3.0.phar';
    }
}
exports.default = Magerun2;
//# sourceMappingURL=magerun2.js.map