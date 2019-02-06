"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mongoose connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost/pollution-api';
_mongoose.default.Promise = global.Promise;

_mongoose.default.connect(uri, {
  useNewUrlParser: true
}, function (err, db) {
  _assert.default.equal(null, err);

  console.log("Connected successfully to database"); // db.close(); turn on for testing
});

_mongoose.default.connection.on("error", console.error.bind(console, "MongoDB connection Error:"));

_mongoose.default.set("debug", true);

var _default = _mongoose.default.connection;
exports.default = _default;
//# sourceMappingURL=database.js.map