const express = require('express');
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { idParam, createStudentRules, updateStudentRules } = require('../validators/studentValidators');

const router = express.Router();

router.get('/', authenticate, studentController.list);
router.post('/', authenticate, authorize('admin'), createStudentRules, validate, studentController.create);
router.put('/:id', authenticate, authorize('admin'), updateStudentRules, validate, studentController.update);
router.delete('/:id', authenticate, authorize('admin'), idParam, validate, studentController.remove);

module.exports = router;
