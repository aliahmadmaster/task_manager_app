const bcrypt = require('bcryptjs');
const db = require('../db/database');

class User {
  static async createUser(name, email, password, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, role],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  static async findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }
  static async getAllUsers(limit, offset) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, name, email, role FROM users WHERE role = ? LIMIT ? OFFSET ?';
  
      db.all(query, ['user', limit, offset], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  };
  // Update an existing user by id
  static async updateUser(id, name, email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`;
      db.run(query, [name, email, hashedPassword, id], function (err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  }
  
  // Delete a user by id
  static deleteUser(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM users WHERE id = ?`;
      db.run(query, [id], function (err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  }

  static async findUserById(id) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT id, name, email, role FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async countUsers() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) as count FROM users WHERE role = ?';
  
      db.get(query, ['user'], (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row.count);
      });
    });
  }

}

module.exports = User;
