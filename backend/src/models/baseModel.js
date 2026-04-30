const pool = require('../config/db');

function createBaseModel(tableName, columns, hiddenColumns = []) {
  const visibleColumns = columns.filter((column) => !hiddenColumns.includes(column));
  const selectColumns = ['id', ...visibleColumns].join(', ');

  return {
    async findAll() {
      const [rows] = await pool.query(`SELECT ${selectColumns} FROM ${tableName} ORDER BY id DESC`);
      return rows;
    },

    async findById(id) {
      const [rows] = await pool.query(`SELECT ${selectColumns} FROM ${tableName} WHERE id = ?`, [id]);
      return rows[0] || null;
    },

    async create(data) {
      const fields = columns.filter((column) => data[column] !== undefined);
      const placeholders = fields.map(() => '?').join(', ');
      const values = fields.map((field) => data[field]);
      const [result] = await pool.query(
        `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`,
        values
      );

      return this.findById(result.insertId);
    },

    async update(id, data) {
      const fields = columns.filter((column) => data[column] !== undefined);

      if (fields.length === 0) {
        return this.findById(id);
      }

      const assignments = fields.map((field) => `${field} = ?`).join(', ');
      const values = [...fields.map((field) => data[field]), id];
      await pool.query(`UPDATE ${tableName} SET ${assignments} WHERE id = ?`, values);
      return this.findById(id);
    },

    async remove(id) {
      const [result] = await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
      return result.affectedRows > 0;
    }
  };
}

module.exports = createBaseModel;
