const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, undefined, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.toJSON = function () {
  var user = this;

  return { id: user._id.toHexString(), email: user.email };
};

userSchema.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, res) => {
      if (res) {
        resolve(this);
      } else {
        reject('Wrong Password');
      }
    });
  });
};

userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        email: user.email,
      },
      process.env.JWT_SECRET
    )
    .toString();

  return token;
};

userSchema.statics.findByCredentials = function (email, password) {
  const User = this;
  return User.findOne({
    email,
  }).then((user) => {
    if (!user) {
      return Promise.reject({ status: 404, error: `User ${email} not found.` });
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject({ status: 400, error: 'Wrong Email or Password' });
        }
      });
    });
  });
};

userSchema.statics.findByToken = async function (token) {
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }

  return User.findOne({
    _id: decoded._id,
    email: decoded.email,
  });
};

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);
module.exports = { User };
