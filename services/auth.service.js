const { User } = require('../models/User');

exports.signup = async (email, password) => {
  const user = new User({
    email,
    password,
  });
  try {
    await user.save();
  } catch (err) {
    return Promise.reject({ error: 'Error saving user!', details: err.stack });
  }
  return Promise.resolve(user);
};

exports.login = async (email, password) => {
  return User.findByCredentials(email, password);
};

exports.generateAuthToken = (user) => {
  return user.generateAuthToken();
};
