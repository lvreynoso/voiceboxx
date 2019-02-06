"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// check-auth.js
const checkAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).send({
      message: `401 Unauthorized`
    });
  }
};

var _default = checkAuth;
exports.default = _default;
//# sourceMappingURL=check-auth.js.map