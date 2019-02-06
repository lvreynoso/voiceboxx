"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _user = _interopRequireDefault(require("../models/user.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// auth.js
const auth = _express.default.Router(); // models


auth.get('/sign-up', (req, res) => {
  res.render('sign-up');
});
auth.post('/sign-up', async (req, res) => {
  const user = new _user.default(req.body);
  const result = await user.save().catch(err => {
    console.log(err);
    return res.status(400).send({
      err: err
    });
  });

  const token = _jsonwebtoken.default.sign({
    _id: user._id
  }, process.env.SECRET, {
    expiresIn: `60 days`
  });

  res.cookie(`nToken`, token, {
    maxAge: 900000,
    httpOnly: true
  });
  res.redirect(`/`);
});
auth.get('/logout', (req, res) => {
  res.clearCookie(`nToken`);
  res.redirect(`/`);
});
auth.get('/login', (req, res) => {
  res.render(`login`);
});
auth.post(`/login`, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = {
    username: username
  };
  const user = await _user.default.findOne(query, `username password`).catch(err => {
    console.log(err);
  });

  if (!user) {
    // user not found
    return res.status(401).send({
      message: `Wrong username or password`
    });
  } // check the password


  user.comparePassword(password, (err, isMatch) => {
    if (!isMatch) {
      return res.status(401).send({
        message: `Wrong username or password`
      });
    } // create a token


    const token = _jsonwebtoken.default.sign({
      _id: user._id,
      username: user.username
    }, process.env.SECRET, {
      expiresIn: `60 days`
    });

    res.cookie(`nToken`, token, {
      maxAge: 900000,
      httpOnly: true
    });
    res.redirect(`/`);
  });
});
var _default = auth;
exports.default = _default;
//# sourceMappingURL=auth.js.map