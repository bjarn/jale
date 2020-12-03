"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const tslib_1 = require("tslib");
const https = tslib_1.__importStar(require("https"));
const request = (url) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        const req = https.request(url, function (res) {
            return resolve(res);
        });
        reject('Request failed');
    });
});
exports.request = request;
//# sourceMappingURL=http.js.map