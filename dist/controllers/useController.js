"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os_1 = require("../utils/os");
const phpFpm_1 = require("../utils/phpFpm");
class UseController {
    constructor() {
        /**
         * Switch the service to the given version.
         */
        this.execute = (service, version) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (service) {
                case 'php':
                    console.log(`Switching to PHP ${version}`);
                    yield this.switchPhpVersionTo(version);
                    return true;
                default:
                    console.log('Invalid service.');
                    return false;
            }
        });
        /**
         * Switch the active PHP version to the provided phpVersion string.
         * @param phpVersion
         */
        this.switchPhpVersionTo = (phpVersion) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const currentPhpVersion = yield phpFpm_1.getLinkedPhpVersion();
            if (!phpFpm_1.supportedPhpVersions.includes(phpVersion)) {
                throw Error(`Invalid PHP version. Please pick one of the following version: ${phpFpm_1.supportedPhpVersions.join(', ')}`);
            }
            if (currentPhpVersion.versionName === phpVersion) {
                console.log(`PHP ${phpVersion} is already active.`);
                return;
            }
            const newPhpVersion = phpFpm_1.getPhpFpmByName(`php@${phpVersion}`);
            if (newPhpVersion.isEndOfLife) {
                console.warn('This PHP version is End Of Life. Be aware it might contain security flaws.');
                console.warn('Please check http://php.net/supported-versions.php for more information.');
            }
            // Make sure the PHP version is installed.
            const isVersionInstalled = yield os_1.client().packageManager.packageIsInstalled(newPhpVersion.service);
            if (!isVersionInstalled) {
                console.log(`Installing PHP ${newPhpVersion.versionName}`);
                yield os_1.client().packageManager.install(newPhpVersion.service, false);
                console.log(`Configuring PHP ${newPhpVersion.versionName}`);
                yield newPhpVersion.configure();
            }
            yield currentPhpVersion.unLinkPhpVersion();
            // TODO: Relink some libs like libjpeg etc.
            yield newPhpVersion.linkPhpVersion();
            yield currentPhpVersion.stop();
            yield newPhpVersion.start();
            console.log(`Successfully switched to PHP ${newPhpVersion.versionName}`);
        });
    }
}
exports.default = UseController;
//# sourceMappingURL=useController.js.map