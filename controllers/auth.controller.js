const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  let user;
  try {
    user = await authService.signup(email, password);
    const token = await authService.generateAuthToken(user);
    return res.status(201).send({ msg: 'User created successfully!', token });
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  let user;
  try {
    user = await authService.login(email, password);
    const token = await authService.generateAuthToken(user);
    return res.status(200).send({ token });
  } catch (err) {
    return res.status(err.status || 400).send({ error: err.error });
  }
};
