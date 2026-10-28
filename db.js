const { Pool } = require('pg');

// Tự động kiểm tra để bật SSL nếu kết nối tới DB Cloud/Từ xa
const isRemoteDb = process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sale_db',
  password: process.env.DB_PASSWORD || '1234',
  port: Number(process.env.DB_PORT || 5432),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Tăng lên 10 giây để tránh bị ngắt khi bắt tay mạng
  ssl: process.env.DB_SSL === 'true' || isRemoteDb ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
