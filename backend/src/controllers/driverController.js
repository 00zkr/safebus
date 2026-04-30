const driverService = require('../services/driverService');

async function startRoute(req, res, next) {
  try {
    const result = await driverService.startRoute(req.user.bus_id);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const result = await driverService.updateStatus(req.user.bus_id, req.body.status);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function updateLocation(req, res, next) {
  try {
    const result = await driverService.updateLocation(req.user.bus_id, req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function nearStop(req, res, next) {
  try {
    const result = await driverService.nearStop(req.user.bus_id, req.body.stop_name);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { startRoute, updateStatus, updateLocation, nearStop };
