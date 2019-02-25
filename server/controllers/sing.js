"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// index.js
const sing = _express.default.Router();

sing.get('/', (req, res) => {
  res.render('sing');
});
var _default = sing;
exports.default = _default;
//# sourceMappingURL=sing.js.map