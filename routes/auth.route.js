const express = require('express');
const { body } = require('express-validator');

const { login, signup } = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/signup',
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Please enter a password with at least 6 characters'),
  signup
);
router.post(
  '/login',
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Please enter a password with at least 6 characters'),
  login
);

module.exports = router;
