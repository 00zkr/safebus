const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('id must be a positive integer')];

const createStudentRules = [
  body('full_name').trim().notEmpty().withMessage('full_name is required'),
  body('parent_phone').trim().notEmpty().withMessage('parent_phone is required'),
  body('bus_id').isInt({ min: 1 }).withMessage('bus_id must be a positive integer'),
  body('route_id').isInt({ min: 1 }).withMessage('route_id must be a positive integer'),
  body('parent_username').optional({ nullable: true }).trim().isLength({ min: 3 }).withMessage('parent_username must be at least 3 characters'),
  body('parent_password').optional({ nullable: true, checkFalsy: true }).isLength({ min: 4 }).withMessage('parent_password must be at least 4 characters')
];

const updateStudentRules = [
  ...idParam,
  body('full_name').optional().trim().notEmpty().withMessage('full_name cannot be empty'),
  body('parent_phone').optional().trim().notEmpty().withMessage('parent_phone cannot be empty'),
  body('bus_id').optional().isInt({ min: 1 }).withMessage('bus_id must be a positive integer'),
  body('route_id').optional().isInt({ min: 1 }).withMessage('route_id must be a positive integer'),
  body('parent_username').optional({ nullable: true }).trim().isLength({ min: 3 }).withMessage('parent_username must be at least 3 characters'),
  body('parent_password').optional({ nullable: true, checkFalsy: true }).isLength({ min: 4 }).withMessage('parent_password must be at least 4 characters')
];

module.exports = { idParam, createStudentRules, updateStudentRules };
