"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// check-cookie.js
const checkCookie = (req, res, next) => {
  console.log(`Checking authentication!`);

  if (typeof req.cookies.nToken === `undefined` || req.cookies.nToken === null) {
    req.user = null;
  } else {
    const token = req.cookies.nToken;
    const decodedToken = _jsonwebtoken.default.decode(token, {
      complete: true
    }) || {};
    req.user = decodedToken.payload;
  }

  next();
};

var _default = checkCookie;
exports.default = _default;
//# sourceMappingURL=check-cookie.js.map