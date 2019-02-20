"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// index.js
const test = _express.default.Router();

test.get('/', (req, res) => {
  res.render('test');
});
var _default = test;
exports.default = _default;
//# sourceMappingURL=test.js.map