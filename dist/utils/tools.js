"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolByName = void 0;
const tslib_1 = require("tslib");
const drush_1 = tslib_1.__importDefault(require("../tools/drush"));
const expose_1 = tslib_1.__importDefault(require("../tools/expose"));
const magerun_1 = tslib_1.__importDefault(require("../tools/magerun"));
const magerun2_1 = tslib_1.__importDefault(require("../tools/magerun2"));
const wpCli_1 = tslib_1.__importDefault(require("../tools/wpCli"));
const getToolByName = (toolName) => {
    let tool;
    switch (toolName) {
        // TODO: Improve the way we handle these checks. This is very NOT memory efficient
        //  as we are constantly initiating new objects.
        case (new wpCli_1.default).alias || (new wpCli_1.default).name:
            tool = new wpCli_1.default();
            break;
        case (new magerun_1.default).alias || (new magerun_1.default).name:
            tool = new magerun_1.default();
            break;
        case (new magerun2_1.default).alias || (new magerun2_1.default).name:
            tool = new magerun2_1.default();
            break;
        case (new drush_1.default).alias || (new drush_1.default).name:
            tool = new drush_1.default();
            break;
        case (new expose_1.default).alias || (new expose_1.default).name:
            tool = new expose_1.default();
            break;
        default:
            throw Error('Invalid tool: ' + toolName);
    }
    return tool;
};
exports.getToolByName = getToolByName;
//# sourceMappingURL=tools.js.map