"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHP_EXTENSIONS = exports.ZEND_EXTENSION_TYPE = exports.NORMAL_EXTENSION_TYPE = void 0;
const tslib_1 = require("tslib");
const apcu_1 = tslib_1.__importDefault(require("./php/apcu"));
const geoip_1 = tslib_1.__importDefault(require("./php/geoip"));
const memcached_1 = tslib_1.__importDefault(require("./php/memcached"));
const xdebug_1 = tslib_1.__importDefault(require("./php/xdebug"));
const yaml_1 = tslib_1.__importDefault(require("./php/yaml"));
const NORMAL_EXTENSION_TYPE = 'extension';
exports.NORMAL_EXTENSION_TYPE = NORMAL_EXTENSION_TYPE;
const ZEND_EXTENSION_TYPE = 'zend_extension';
exports.ZEND_EXTENSION_TYPE = ZEND_EXTENSION_TYPE;
/**
 * All extensions available in Jale.
 */
const PHP_EXTENSIONS = [
    apcu_1.default,
    geoip_1.default,
    memcached_1.default,
    xdebug_1.default,
    yaml_1.default
];
exports.PHP_EXTENSIONS = PHP_EXTENSIONS;
//# sourceMappingURL=extensions.js.map