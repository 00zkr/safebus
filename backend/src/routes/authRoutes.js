const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { loginRules } = require('../validators/authValidators');

const router = express.Router();

router.post('/login', loginRules, validate, authController.login);

module.exports = router;
