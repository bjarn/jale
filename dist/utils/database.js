"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseByName = void 0;
const tslib_1 = require("tslib");
const mariadb_1 = tslib_1.__importDefault(require("../services/mariadb"));
const mysql57_1 = tslib_1.__importDefault(require("../services/mysql57"));
const mysql80_1 = tslib_1.__importDefault(require("../services/mysql80"));
const getDatabaseByName = (databaseType) => {
    let database;
    switch (databaseType) {
        case (new mysql80_1.default).service:
            database = new mysql80_1.default();
            break;
        case (new mysql57_1.default).service:
            database = new mysql57_1.default();
            break;
        case (new mariadb_1.default).service:
            database = new mariadb_1.default();
            break;
        default:
            throw Error('Invalid database type version: ' + databaseType);
    }
    return database;
};
exports.getDatabaseByName = getDatabaseByName;
//# sourceMappingURL=database.js.map