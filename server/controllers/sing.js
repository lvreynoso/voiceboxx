"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _song = _interopRequireDefault(require("../models/song.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// index.js
const sing = _express.default.Router(); // models


sing.get('/', (req, res) => {
  res.render('sing');
});
sing.get('/:artist/:song', async (req, res) => {
  let query = {
    slug: `${req.params.artist}-${req.params.song}`
  };
  const song = await _song.default.findOne(query).catch(err => {
    console.log(err);
  });
  console.log(song);
  res.render('sing', {
    song: song
  });
});
var _default = sing;
exports.default = _default;
//# sourceMappingURL=sing.js.map