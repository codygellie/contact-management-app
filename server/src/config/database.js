const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 4000, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(process.env.CA_CERT_PATH), 
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM contacts');
    if (rows[0].count === 0) {
      await connection.execute(`
        INSERT INTO contacts (name, email, phone) VALUES
        ('John Doe', 'john@example.com', '+1-555-0123'),
        ('Jane Smith', 'jane@example.com', '+1-555-0124'),
        ('Mike Johnson', 'mike@example.com', '+1-555-0125'),
        ('Sarah Wilson', 'sarah@example.com', '+1-555-0126'),
        ('David Brown', 'david@example.com', '+1-555-0127')
      `);
    }
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

module.exports = { pool, initDatabase };

