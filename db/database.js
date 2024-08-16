const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database('./taskmanagement.db', (err) => {
  if (err) {
    console.error('Failed to connect to the database.', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize the tables and seed data
db.serialize(async () => {
  // Create Users table with a role field
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'user'))
    )
  `);

  // Create Tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT CHECK( status IN ('ToDo', 'InProgress', 'Done') ) DEFAULT 'ToDo',
      userId INTEGER,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Check if admin and user exist, if not, insert them
  db.get(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`, async (err, row) => {
    if (row.count === 0) {
      const hashedAdminPassword = await bcrypt.hash('admin@123', 10);
      db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        ['Admin', 'admin@gmail.com', hashedAdminPassword, 'admin'],
        (err) => {
          if (err) {
            console.error('Failed to create admin user', err);
          } else {
            console.log('Admin user created.');
          }
        }
      );

      const hashedUserPassword = await bcrypt.hash('user@123', 10);
      db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        ['User', 'user@gmail.com', hashedUserPassword, 'user'],
        (err) => {
          if (err) {
            console.error('Failed to create user', err);
          } else {
            console.log('User created.');
          }
        }
      );
    }
  });
});

module.exports = db;
