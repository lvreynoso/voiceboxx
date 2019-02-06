"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// index.js
const index = _express.default.Router();

index.get('/', (req, res) => {
  const currentUser = req.user;
  console.log(req.cookies);
  res.render('index', {
    currentUser
  });
});
var _default = index;
exports.default = _default;
//# sourceMappingURL=index.js.map