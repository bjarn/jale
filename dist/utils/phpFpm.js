"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkedPhpVersion = exports.getPhpFpmByName = exports.supportedPhpVersions = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const phpFpm72_1 = tslib_1.__importDefault(require("../services/phpFpm72"));
const phpFpm73_1 = tslib_1.__importDefault(require("../services/phpFpm73"));
const phpFpm74_1 = tslib_1.__importDefault(require("../services/phpFpm74"));
const phpFpm80_1 = tslib_1.__importDefault(require("../services/phpFpm80"));
const supportedPhpVersions = [
    (new phpFpm80_1.default).versionName,
    (new phpFpm74_1.default).versionName,
    (new phpFpm73_1.default).versionName,
    (new phpFpm72_1.default).versionName,
];
exports.supportedPhpVersions = supportedPhpVersions;
const getPhpFpmByName = (phpVersion) => {
    let phpService;
    switch (phpVersion) {
        case (new phpFpm72_1.default).service:
            phpService = new phpFpm72_1.default();
            break;
        case (new phpFpm73_1.default).service:
            phpService = new phpFpm73_1.default();
            break;
        case (new phpFpm74_1.default).service:
            phpService = new phpFpm74_1.default();
            break;
        case (new phpFpm80_1.default).service:
            phpService = new phpFpm80_1.default();
            break;
        default:
            throw Error('Invalid PHP version: ' + phpVersion);
    }
    return phpService;
};
exports.getPhpFpmByName = getPhpFpmByName;
/**
 * Get the currently linked Php Fpm binary.
 */
const getLinkedPhpVersion = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const phpLink = yield fs.lstatSync('/usr/local/bin/php');
    if (!phpLink.isSymbolicLink()) {
        throw Error(`Php executable is not found.`);
    }
    const phpBinary = yield fs.realpathSync('/usr/local/bin/php');
    let linkedPhpVersion;
    supportedPhpVersions.forEach((versionName) => {
        if (phpBinary.includes(versionName)) {
            linkedPhpVersion = getPhpFpmByName(`php@${versionName}`);
        }
    });
    if (linkedPhpVersion) {
        return linkedPhpVersion;
    }
    else {
        throw Error('Unable to determine linked PHP version');
    }
});
exports.getLinkedPhpVersion = getLinkedPhpVersion;
//# sourceMappingURL=phpFpm.js.map