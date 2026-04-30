const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function columnExists(tableName, columnName) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );

  return rows[0].count > 0;
}

async function indexExists(tableName, indexName) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND INDEX_NAME = ?`,
    [tableName, indexName]
  );

  return rows[0].count > 0;
}

async function addColumnIfMissing(tableName, columnName, definition) {
  if (!(await columnExists(tableName, columnName))) {
    await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function addIndexIfMissing(tableName, indexName, definition) {
  if (!(await indexExists(tableName, indexName))) {
    await pool.query(`ALTER TABLE ${tableName} ADD ${definition}`);
  }
}

async function seedMissingCredentials() {
  const parentHash = await bcrypt.hash('parent123', 10);
  const driverHash = await bcrypt.hash('driver123', 10);

  await pool.query(
    `UPDATE students
     SET parent_username = CASE WHEN id = 1 THEN 'parent' ELSE CONCAT('parent', id) END,
         parent_password_hash = ?
     WHERE parent_username IS NULL OR parent_username = ''`,
    [parentHash]
  );

  await pool.query(
    `UPDATE buses
     SET driver_username = CASE WHEN id = 1 THEN 'driver' ELSE CONCAT('driver', id) END,
         driver_password_hash = ?
     WHERE driver_username IS NULL OR driver_username = ''`,
    [driverHash]
  );
}

async function ensureCredentialColumns() {
  await addColumnIfMissing('students', 'parent_username', 'VARCHAR(80) NULL');
  await addColumnIfMissing('students', 'parent_password_hash', 'VARCHAR(255) NULL');
  await addColumnIfMissing('buses', 'driver_username', 'VARCHAR(80) NULL');
  await addColumnIfMissing('buses', 'driver_password_hash', 'VARCHAR(255) NULL');

  await seedMissingCredentials();

  await addIndexIfMissing('students', 'uq_students_parent_username', 'UNIQUE KEY uq_students_parent_username (parent_username)');
  await addIndexIfMissing('buses', 'uq_buses_driver_username', 'UNIQUE KEY uq_buses_driver_username (driver_username)');
}

module.exports = { ensureCredentialColumns };
