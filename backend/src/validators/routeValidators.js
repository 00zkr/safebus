const { body, param } = require('express-validator');

const timePattern = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const idParam = [param('id').isInt({ min: 1 }).withMessage('id must be a positive integer')];

const createRouteRules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('stops').optional({ nullable: true }).isArray().withMessage('stops must be an array'),
  body('start_time').matches(timePattern).withMessage('start_time must use HH:mm or HH:mm:ss'),
  body('end_time').matches(timePattern).withMessage('end_time must use HH:mm or HH:mm:ss'),
  body('bus_id').isInt({ min: 1 }).withMessage('bus_id must be a positive integer')
];

const updateRouteRules = [
  ...idParam,
  body('name').optional().trim().notEmpty().withMessage('name cannot be empty'),
  body('stops').optional({ nullable: true }).isArray().withMessage('stops must be an array'),
  body('start_time').optional().matches(timePattern).withMessage('start_time must use HH:mm or HH:mm:ss'),
  body('end_time').optional().matches(timePattern).withMessage('end_time must use HH:mm or HH:mm:ss'),
  body('bus_id').optional().isInt({ min: 1 }).withMessage('bus_id must be a positive integer')
];

module.exports = { idParam, createRouteRules, updateRouteRules };
