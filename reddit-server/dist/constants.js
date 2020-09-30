"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_RESET_KEY = exports.COOKIE_NAME = exports.SERVER_PORT = exports.IS_PROD = void 0;
exports.IS_PROD = process.env.NODE_ENV === 'production';
exports.SERVER_PORT = 4000;
exports.COOKIE_NAME = "qid";
exports.PASSWORD_RESET_KEY = "password_uuid::";
//# sourceMappingURL=constants.js.map