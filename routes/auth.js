const express = require('express');
const router = express.Router();

router.get('', (req, res) => {
  res.send({ response: 'Hello from auth router' });
});
module.exports = router;
