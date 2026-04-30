const createBaseModel = require('./baseModel');
const pool = require('../config/db');

const baseModel = createBaseModel('routes', ['name', 'stops', 'start_time', 'end_time', 'bus_id']);

module.exports = {
  ...baseModel,

  async findByBusId(busId) {
    const [rows] = await pool.query(
      `SELECT id, name, stops, start_time, end_time, bus_id
       FROM routes
       WHERE bus_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [busId]
    );

    return rows[0] || null;
  }
};
