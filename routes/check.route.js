const express = require('express');
const { body } = require('express-validator');

const {
  createCheck,
  deleteCheck,
  getAllChecks,
  getCheck,
  updateCheck,
} = require('../controllers/check.controller');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.post(
  '/',
  authenticate,
  body('name').not().isEmpty(),
  body('url').not().isEmpty(),
  body('protocol').not().isEmpty(),
  body('ignoreSSL').not().isEmpty(),
  createCheck
);

router.put('/:id', authenticate, updateCheck);

router.delete('/:id', authenticate, deleteCheck);

router.get('/all', authenticate, getAllChecks);

router.get('/:id', authenticate, getCheck);


module.exports = router;
