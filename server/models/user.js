"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// user.js
// our User model
const Schema = _mongoose.default.Schema;
const UserSchema = new Schema({
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: "Post"
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  votes: {
    type: Map,
    of: Boolean,
    default: {}
  },
  admin: {
    type: Boolean
  }
});
UserSchema.pre("save", function (next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  } // encrypt password


  const user = this;

  if (!user.isModified(`password`)) {
    return next();
  }

  _bcryptjs.default.genSalt(10, (err, salt) => {
    _bcryptjs.default.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, done) {
  _bcryptjs.default.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

const User = _mongoose.default.model('User', UserSchema);

var _default = User;
exports.default = _default;
//# sourceMappingURL=user.js.map