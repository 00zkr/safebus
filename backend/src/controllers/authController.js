const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body.username, req.body.password);

    if (!result) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { login };
