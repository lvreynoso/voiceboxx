"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// song.js
const Schema = _mongoose.default.Schema;
const SongSchema = new Schema({
  slug: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  lyrics: {
    type: String
  },
  notes: {
    type: String
  },
  tab: {
    type: String
  },
  data: Buffer
});

const Song = _mongoose.default.model('Song', SongSchema);

var _default = Song;
exports.default = _default;
//# sourceMappingURL=song.js.map