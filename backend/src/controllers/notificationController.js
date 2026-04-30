const notificationService = require('../services/notificationService');
const driverService = require('../services/driverService');

async function list(req, res, next) {
  try {
    const filters = { ...req.query };

    if (req.user.role === 'parent') {
      filters.student_id = req.user.student_id;
    }

    if (req.user.role === 'driver') {
      filters.bus_id = req.user.bus_id;
    }

    const notifications = await notificationService.list(filters);
    return res.json(notifications);
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    if (req.body.type === 'near_stop') {
      await driverService.ensureNearStopAllowedForStudent(req.body.student_id);
    }

    const notification = await notificationService.create(req.body);
    return res.status(201).json(notification);
  } catch (error) {
    return next(error);
  }
}

module.exports = { list, create };
