"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const tslib_1 = require("tslib");
const darwin_1 = tslib_1.__importDefault(require("../client/os/darwin"));
function client() {
    switch (process.platform) {
        case 'darwin':
            return new darwin_1.default;
        default:
            return new darwin_1.default; // TODO: Catch unsupported OS. Currently just returning MacOS stuff as we're just creating a POC.
    }
}
exports.client = client;
//# sourceMappingURL=os.js.map