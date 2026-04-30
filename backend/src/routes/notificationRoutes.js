const express = require('express');
const notificationController = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  listNotificationRules,
  createNotificationRules
} = require('../validators/notificationValidators');

const router = express.Router();

router.get('/', authenticate, listNotificationRules, validate, notificationController.list);
router.post(
  '/',
  authenticate,
  authorize('admin', 'driver'),
  createNotificationRules,
  validate,
  notificationController.create
);

module.exports = router;
