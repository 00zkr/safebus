const { body, query } = require('express-validator');

const types = ['departure', 'near_stop', 'arrival', 'delay'];

const listNotificationRules = [
  query('student_id').optional().isInt({ min: 1 }).withMessage('student_id must be a positive integer'),
  query('bus_id').optional().isInt({ min: 1 }).withMessage('bus_id must be a positive integer'),
  query('type').optional().isIn(types).withMessage(`type must be one of: ${types.join(', ')}`),
  query('date').optional().isISO8601().withMessage('date must be YYYY-MM-DD')
];

const createNotificationRules = [
  body('student_id').isInt({ min: 1 }).withMessage('student_id must be a positive integer'),
  body('type').isIn(types).withMessage(`type must be one of: ${types.join(', ')}`),
  body('message').trim().notEmpty().withMessage('message is required')
];

module.exports = { listNotificationRules, createNotificationRules };
