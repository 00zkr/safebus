const pool = require('../config/db');
const createBaseModel = require('./baseModel');

const baseModel = createBaseModel('parent_notifications', ['student_id', 'type', 'message', 'created_at']);

module.exports = {
  ...baseModel,

  async createMany(notifications) {
    if (!notifications.length) {
      return [];
    }

    const values = notifications.map((notification) => [
      notification.student_id,
      notification.type,
      notification.message
    ]);

    await pool.query(
      'INSERT INTO parent_notifications (student_id, type, message) VALUES ?',
      [values]
    );

    return notifications;
  },

  async findFiltered(filters = {}) {
    const where = [];
    const values = [];

    if (filters.student_id) {
      where.push('pn.student_id = ?');
      values.push(filters.student_id);
    }

    if (filters.bus_id) {
      where.push('s.bus_id = ?');
      values.push(filters.bus_id);
    }

    if (filters.type) {
      where.push('pn.type = ?');
      values.push(filters.type);
    }

    if (filters.date) {
      where.push('DATE(pn.created_at) = ?');
      values.push(filters.date);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [rows] = await pool.query(
      `SELECT pn.id, pn.student_id, pn.type, pn.message, pn.created_at,
              s.full_name AS student_name, s.bus_id
       FROM parent_notifications pn
       JOIN students s ON s.id = pn.student_id
       ${whereSql}
       ORDER BY pn.created_at DESC`,
      values
    );

    return rows;
  }
};
