const express = require('express');
const demoController = require('../controllers/demoController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/reset', authenticate, authorize('admin'), demoController.reset);

module.exports = router;
