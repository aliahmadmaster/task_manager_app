const db = require('../db/database');

class Task {

  static createTask(title, description, taskStatus, userId) {
    console.log('');
    return new Promise((resolve, reject) => {
      // SQL query to insert the task
      const query = `
        INSERT INTO tasks (title, description, status, userId) 
        VALUES (?, ?, ?, ?)
      `;
      
      // Execute the query
      db.run(query, [title, description, taskStatus, userId], function (err) {
        if (err) {
          console.error('Error inserting task:', err); // Log the error for debugging
          return reject(err); // Reject the promise if there's an error
        }
        
        console.log('Task created with ID:', this.lastID); // Log the task ID
        resolve(this.lastID); // Resolve the promise with the last inserted ID
      });
    });
  }
  
  
  // Delete a task by id
  static deleteTask(id, userId, role) {
    let query;
    if(role === "admin"){
      query = `DELETE FROM tasks WHERE id = ?`
    }
    query = `DELETE FROM tasks WHERE id = ? AND userId = ?`
    return new Promise((resolve, reject) => {
      db.run(query, [id, userId], function (err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  }

  // Get paginated and sorted tasks for a specific user
  static async getTasksByUserId(userId, limit, offset, sortField = 'id', sortOrder = 'ASC') {
    return new Promise((resolve, reject) => {
      // Build the SQL query
      const query = `
        SELECT * FROM tasks 
        WHERE userId = ? 
        ORDER BY ${sortField} ${sortOrder === 'DESC' ? 'DESC' : 'ASC'} 
        LIMIT ? OFFSET ?
      `;
  
      db.all(query, [userId, limit, offset], (err, rows) => {
        if (err) {
          return reject(err);  
        }
        resolve(rows);  
      });
    });
  }


  static async getAllTasks(limit, offset, sortField = 'id', sortOrder = 'DESC') {
    return new Promise((resolve, reject) => {
      const query = `
       SELECT * FROM tasks
      ORDER BY ${sortField} ${sortOrder === 'DESC' ? 'DESC' : 'ASC'} 
      LIMIT ? OFFSET ?`;

      db.all(query, [limit, offset], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  // Get total task count for a user (used for pagination)
  static async getTaskCountByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) as count FROM tasks WHERE userId = ?`;
      db.get(query, [userId], (err, row) => {
        if (err) reject(err);
        resolve(row.count);
      });
    });
  }

  static updateTaskStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE tasks SET status = ? WHERE id = ?`, [status, id], function (err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  }
  
  static updateTask(id, title, description, status, userId) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE tasks 
        SET title = ?, description = ?, status = ? 
        WHERE id = ? AND userId = ?`;
  
      // Execute the query
      db.run(query, [title, description, status, id, userId], function (err) {
        if (err) {
          return reject(err);  // Reject the promise on error
        }
  
        // Resolve with the number of rows affected (updated)
        resolve(this.changes);
      });
    });
  }

  static searchTasks(userId, searchTerm) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM tasks 
        WHERE userId = ? AND (title LIKE ? OR description LIKE ?)`;
  
      const wildcardSearchTerm = `%${searchTerm}%`;
  
      // Execute the query
      db.all(query, [userId, wildcardSearchTerm, wildcardSearchTerm], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  static filterTasks(filters){
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM tasks WHERE 1=1';
      let queryParams = [];

      if (filters.status) {
        query += ' AND status = ?';
        queryParams.push(filters.status);
      }

      if (filters.userId) {
        query += ' AND userId = ?';
        queryParams.push(filters.userId);
      }

      if (filters.title) {
        query += ' AND title LIKE ?';
        queryParams.push(`%${filters.title}%`);
      }

      if (filters.description) {
        query += ' AND description LIKE ?';
        queryParams.push(`%${filters.description}%`);
      }

      query += ' ORDER BY id ASC'; 

      // Pagination
      if (filters.limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(filters.limit));
      }

      if (filters.offset) {
        query += ' OFFSET ?';
        queryParams.push(parseInt(filters.offset));
      }

      db.all(query, queryParams, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  };
  
}

module.exports = Task;
