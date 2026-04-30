const express = require('express');
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { idParam, createRouteRules, updateRouteRules } = require('../validators/routeValidators');

const router = express.Router();

router.get('/', authenticate, routeController.list);
router.post('/', authenticate, authorize('admin'), createRouteRules, validate, routeController.create);
router.put('/:id', authenticate, authorize('admin'), updateRouteRules, validate, routeController.update);
router.delete('/:id', authenticate, authorize('admin'), idParam, validate, routeController.remove);

module.exports = router;
