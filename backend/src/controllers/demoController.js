const demoService = require('../services/demoService');

async function reset(req, res, next) {
  try {
    const result = await demoService.resetDemoData();
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { reset };
