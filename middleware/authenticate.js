const { User } = require('../models/User');

const authenticate = (req, res, next) => {
  let token = req.header('Token');
  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      next();
    })
    .catch((e) => {
      res
        .status(401)
        .send({ error: 'You are not logged in!', details: e.stack });
    });
};

module.exports = { authenticate };
