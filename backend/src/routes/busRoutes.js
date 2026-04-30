const express = require('express');
const busController = require('../controllers/busController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { idParam, createBusRules, updateBusRules } = require('../validators/busValidators');

const router = express.Router();

router.get('/', authenticate, busController.list);
router.post('/', authenticate, authorize('admin'), createBusRules, validate, busController.create);
router.put('/:id', authenticate, authorize('admin'), updateBusRules, validate, busController.update);
router.delete('/:id', authenticate, authorize('admin'), idParam, validate, busController.remove);

module.exports = router;
