"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkedDatabase = exports.getDatabaseByName = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const mariadb_1 = tslib_1.__importDefault(require("../services/mariadb"));
const mysql57_1 = tslib_1.__importDefault(require("../services/mysql57"));
const mysql80_1 = tslib_1.__importDefault(require("../services/mysql80"));
const supportedDatabases = [
    (new mysql80_1.default).service,
    (new mysql57_1.default).service,
    (new mariadb_1.default).service
];
/**
 * Get the Database object by the name of the service.
 * @param databaseType
 */
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
/**
 * Get the currently linked Mysql binary.
 */
const getLinkedDatabase = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const mysqlLink = yield fs_1.default.lstatSync('/usr/local/bin/mysql');
    if (!mysqlLink.isSymbolicLink()) {
        throw Error(`Mysql executable is not found.`);
    }
    const mysqlBinary = yield fs_1.default.realpathSync('/usr/local/bin/mysql');
    let linkedDatabase;
    supportedDatabases.forEach((versionName) => {
        if (mysqlBinary.includes(versionName)) {
            linkedDatabase = getDatabaseByName(versionName);
        }
    });
    if (linkedDatabase) {
        return linkedDatabase;
    }
    else {
        throw Error('Unable to determine linked database');
    }
});
exports.getLinkedDatabase = getLinkedDatabase;
//# sourceMappingURL=database.js.map