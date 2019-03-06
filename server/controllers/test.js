"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.replace");

var _express = _interopRequireDefault(require("express"));

var _song = _interopRequireDefault(require("../models/song.js"));

var _multer = _interopRequireDefault(require("multer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// index.js
const test = _express.default.Router(); // model


const storage = _multer.default.memoryStorage();

const upload = (0, _multer.default)({
  storage: storage
});
test.get('/', (req, res) => {
  res.render('test');
});
test.get('/upload', (req, res) => {
  res.render('upload');
});
test.post('/upload', upload.array('data', 1), async (req, res) => {
  console.log("upload incoming!");
  let newlineRegex = /\\n/gi;
  let cleanTab = req.body.tab.replace(newlineRegex, '\n');
  var input = {
    slug: req.body.slug,
    artist: req.body.artist,
    title: req.body.title,
    lyrics: req.body.lyrics,
    notes: req.body.notes,
    tab: cleanTab,
    data: Buffer.from(req.files[0].buffer)
  };
  let song = new _song.default(input);
  song.save().catch(err => {
    console.log(err);
  });
  console.log(song.tab);
  res.status(200);
});
var _default = test;
exports.default = _default;
//# sourceMappingURL=test.js.map