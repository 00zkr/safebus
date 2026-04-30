require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'transport_user',
    password: process.env.DB_PASSWORD || 'transport_pass',
    database: process.env.DB_NAME || 'school_transport'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_this_secret_for_demo',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  }
};
