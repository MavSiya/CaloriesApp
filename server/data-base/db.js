const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'caloriesapp'
});

async function initDB() {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isActivated BOOLEAN DEFAULT FALSE,
        activationLink VARCHAR(255)
      )
    `;
    const createTokensTableQuery = `
  CREATE TABLE IF NOT EXISTS tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    refreshToken TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`;  
    try {
      const connection = await pool.getConnection();
      await connection.query(createUsersTableQuery);
        await connection.query(createTokensTableQuery);
      connection.release();
      console.log('Таблиці провірені/створені');
    } catch (err) {
      console.error('Помилка при створенні таблиці:', err);
    }
  }

module.exports = {pool, initDB};
