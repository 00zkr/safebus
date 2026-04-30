const { body } = require('express-validator');

const updateStatusRules = [
  body('status')
    .isIn(['departure', 'delay', 'arrival'])
    .withMessage('status must be one of: departure, delay, arrival')
];

const updateLocationRules = [
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('lat must be a valid latitude'),
  body('lng').isFloat({ min: -180, max: 180 }).withMessage('lng must be a valid longitude')
];

const nearStopRules = [
  body('stop_name').trim().notEmpty().withMessage('stop_name is required')
];

module.exports = { updateStatusRules, updateLocationRules, nearStopRules };
