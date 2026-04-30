const createBaseModel = require('./baseModel');
const pool = require('../config/db');

const busColumns = ['name', 'driver_name', 'status', 'current_lat', 'current_lng', 'driver_username', 'driver_password_hash'];
const baseModel = createBaseModel('buses', busColumns, ['driver_password_hash']);

module.exports = {
  ...baseModel,

  async findByDriverUsername(username) {
    const [rows] = await pool.query(
      `SELECT id, name, driver_name, driver_username, driver_password_hash
       FROM buses
       WHERE driver_username = ?
       LIMIT 1`,
      [username]
    );

    return rows[0] || null;
  }
};
