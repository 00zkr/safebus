const { body, param } = require('express-validator');

const statuses = ['idle', 'active', 'delayed', 'completed'];
const idParam = [param('id').isInt({ min: 1 }).withMessage('id must be a positive integer')];

const createBusRules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('driver_name').trim().notEmpty().withMessage('driver_name is required'),
  body('status').optional().isIn(statuses).withMessage(`status must be one of: ${statuses.join(', ')}`),
  body('current_lat').optional({ nullable: true }).isFloat({ min: -90, max: 90 }).withMessage('current_lat must be a valid latitude'),
  body('current_lng').optional({ nullable: true }).isFloat({ min: -180, max: 180 }).withMessage('current_lng must be a valid longitude'),
  body('driver_username').optional({ nullable: true }).trim().isLength({ min: 3 }).withMessage('driver_username must be at least 3 characters'),
  body('driver_password').optional({ nullable: true, checkFalsy: true }).isLength({ min: 4 }).withMessage('driver_password must be at least 4 characters')
];

const updateBusRules = [
  ...idParam,
  body('name').optional().trim().notEmpty().withMessage('name cannot be empty'),
  body('driver_name').optional().trim().notEmpty().withMessage('driver_name cannot be empty'),
  body('status').optional().isIn(statuses).withMessage(`status must be one of: ${statuses.join(', ')}`),
  body('current_lat').optional({ nullable: true }).isFloat({ min: -90, max: 90 }).withMessage('current_lat must be a valid latitude'),
  body('current_lng').optional({ nullable: true }).isFloat({ min: -180, max: 180 }).withMessage('current_lng must be a valid longitude'),
  body('driver_username').optional({ nullable: true }).trim().isLength({ min: 3 }).withMessage('driver_username must be at least 3 characters'),
  body('driver_password').optional({ nullable: true, checkFalsy: true }).isLength({ min: 4 }).withMessage('driver_password must be at least 4 characters')
];

module.exports = { idParam, createBusRules, updateBusRules };
