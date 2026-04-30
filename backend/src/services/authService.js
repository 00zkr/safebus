const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { findUser } = require('../utils/demoUsers');
const studentModel = require('../models/studentModel');
const busModel = require('../models/busModel');

async function login(username, password) {
  let user = findUser(username);

  if (!user) {
    const parent = await studentModel.findByParentUsername(username);

    if (parent) {
      user = {
        username: parent.parent_username,
        passwordHash: parent.parent_password_hash,
        role: 'parent',
        student_id: parent.id
      };
    }
  }

  if (!user) {
    const driver = await busModel.findByDriverUsername(username);

    if (driver) {
      user = {
        username: driver.driver_username,
        passwordHash: driver.driver_password_hash,
        role: 'driver',
        bus_id: driver.id
      };
    }
  }

  if (!user) {
    return null;
  }

  if (!user.passwordHash) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return null;
  }

  const payload = {
    username: user.username,
    role: user.role,
    bus_id: user.bus_id,
    student_id: user.student_id
  };

  return {
    token: jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn }),
    user: payload
  };
}

module.exports = { login };
