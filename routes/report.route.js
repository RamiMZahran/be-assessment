const express = require('express');

const {
  getAllCheckReports,
  getCheckReport,
} = require('../controllers/report.controller');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.get('/all', authenticate, getAllCheckReports);

router.get('/:checkId', authenticate, getCheckReport);

module.exports = router;
