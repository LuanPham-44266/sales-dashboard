const { Pool } = require('pg');

// Khởi tạo Pool
const poolConfig = {};

if (process.env.DATABASE_URL) {
  // Ưu tiên dùng DATABASE_URL nếu có (khi chạy trên Render)
  poolConfig.connectionString = process.env.DATABASE_URL;
  // Bật SSL khi dùng URL (Render yêu cầu)
  poolConfig.ssl = { rejectUnauthorized: false }; 
} else {
  // Dự phòng khi chạy local bằng các biến rời rạc
  poolConfig.user = process.env.DB_USER;
  poolConfig.host = process.env.DB_HOST;
  poolConfig.database = process.env.DB_NAME;
  poolConfig.password = process.env.DB_PASSWORD;
  poolConfig.port = Number(process.env.DB_PORT || 5432);
}

// Thêm các cấu hình chung
poolConfig.max = 20;
poolConfig.idleTimeoutMillis = 30000;
poolConfig.connectionTimeoutMillis = 10000;

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL client error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};