const createBaseModel = require('./baseModel');
const pool = require('../config/db');

const studentColumns = ['full_name', 'parent_phone', 'bus_id', 'route_id', 'parent_username', 'parent_password_hash'];
const baseModel = createBaseModel('students', studentColumns, ['parent_password_hash']);

module.exports = {
  ...baseModel,

  async findByBusId(busId) {
    const [rows] = await pool.query(
      `SELECT id, full_name, parent_phone, bus_id, route_id, parent_username
       FROM students
       WHERE bus_id = ?
       ORDER BY full_name ASC`,
      [busId]
    );

    return rows;
  },

  async findByParentUsername(username) {
    const [rows] = await pool.query(
      `SELECT id, full_name, parent_username, parent_password_hash
       FROM students
       WHERE parent_username = ?
       LIMIT 1`,
      [username]
    );

    return rows[0] || null;
  }
};
