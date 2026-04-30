const express = require('express');
const driverController = require('../controllers/driverController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { updateStatusRules, updateLocationRules, nearStopRules } = require('../validators/driverValidators');

const router = express.Router();

router.post('/start-route', authenticate, authorize('driver'), driverController.startRoute);
router.post('/update-status', authenticate, authorize('driver'), updateStatusRules, validate, driverController.updateStatus);
router.post('/update-location', authenticate, authorize('driver'), updateLocationRules, validate, driverController.updateLocation);
router.post('/near-stop', authenticate, authorize('driver'), nearStopRules, validate, driverController.nearStop);

module.exports = router;
